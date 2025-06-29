from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.db.models import Sum, Count
from .models import Investment
from .serializers import InvestmentSerializer, InvestmentCreateSerializer
from investments.models import Business
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from django.db import models

# Create your views here.

class InvestmentCreateView(generics.CreateAPIView):
    serializer_class = InvestmentCreateSerializer
    permission_classes = [IsAuthenticated]
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        # Create the investment record
        investment = serializer.save()
        
        # Update the business funding and backers count
        business = investment.business
        business.current_funding += investment.amount
        business.backers += 1
        business.save(update_fields=['current_funding', 'backers'])
        
        # Return the updated business data
        return Response({
            'message': 'Investment successful!',
            'investment': InvestmentSerializer(investment, context={'request': request}).data,
            'business_updated': {
                'current_funding': business.current_funding,
                'backers': business.backers
            }
        }, status=status.HTTP_201_CREATED)

class UserInvestmentsListView(generics.ListAPIView):
    serializer_class = InvestmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            return Investment.objects.filter(user=self.request.user)
        except Exception as e:
            import traceback
            print('Error in UserInvestmentsListView:', e)
            traceback.print_exc()
            from rest_framework.exceptions import APIException
            raise APIException(f'Error fetching investments: {e}')

class BusinessInvestmentsListView(generics.ListAPIView):
    serializer_class = InvestmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        business_id = self.kwargs.get('business_id')
        return Investment.objects.filter(business_id=business_id)

class BusinessInvestmentStatsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, business_id):
        try:
            business = Business.objects.get(id=business_id)
            
            # Check if the user is the owner of the business
            if business.user != request.user:
                return Response(
                    {'error': 'You can only view statistics for your own businesses.'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Get all investments for this business
            investments = Investment.objects.filter(business=business).select_related('user')
            
            # Calculate total invested amount
            total_invested = investments.aggregate(total=Sum('amount'))['total'] or 0
            
            # Get individual investor data (top 10 by amount)
            investor_data = []
            for investment in investments.order_by('-amount')[:10]:
                investor_data.append({
                    'user_id': investment.user.id,
                    'username': investment.user.username,
                    'first_name': investment.user.first_name,
                    'last_name': investment.user.last_name,
                    'amount': float(investment.amount),
                    'invested_at': investment.invested_at
                })
            
            # Calculate "Others" amount if there are more than 10 investors
            total_from_top_investors = sum(item['amount'] for item in investor_data)
            others_amount = float(total_invested) - total_from_top_investors
            
            # Prepare chart data
            chart_data = {
                'labels': [f"{item['first_name']} {item['last_name']}" if item['first_name'] and item['last_name'] else item['username'] for item in investor_data],
                'amounts': [item['amount'] for item in investor_data],
                'colors': [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
                ]
            }
            
            # Add "Others" if there are additional investors
            if others_amount > 0:
                chart_data['labels'].append('Others')
                chart_data['amounts'].append(others_amount)
                chart_data['colors'].append('#E7E7E7')
            
            # Summary statistics
            summary = {
                'total_invested': float(total_invested),
                'total_investors': investments.count(),
                'business_title': business.title,
                'funding_goal': float(business.funding_goal),
                'progress_percentage': (float(total_invested) / float(business.funding_goal)) * 100 if business.funding_goal > 0 else 0
            }
            
            return Response({
                'summary': summary,
                'investor_data': investor_data,
                'chart_data': chart_data,
                'others_amount': others_amount if others_amount > 0 else 0
            })
            
        except Business.DoesNotExist:
            return Response(
                {'error': 'Business not found.'}, 
                status=status.HTTP_404_NOT_FOUND
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def investment_list(request):
    """List all investments"""
    investments = Investment.objects.all()
    serializer = InvestmentSerializer(investments, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_investment(request):
    """Create a new investment"""
    serializer = InvestmentSerializer(data=request.data)
    if serializer.is_valid():
        # Check if user already invested in this business
        existing_investment = Investment.objects.filter(
            user=request.user,
            business=serializer.validated_data['business']
        ).first()
        
        if existing_investment:
            return Response(
                {'error': 'You have already invested in this business'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user has enough funds
        if request.user.fund < serializer.validated_data['amount']:
            return Response(
                {'error': 'Insufficient funds'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Deduct amount from user's fund
        request.user.fund -= serializer.validated_data['amount']
        request.user.save(update_fields=['fund'])
        
        # Add amount to business current funding
        business = serializer.validated_data['business']
        business.current_funding += serializer.validated_data['amount']
        business.backers = Investment.objects.filter(business=business).count() + 1
        business.save(update_fields=['current_funding', 'backers'])
        
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def business_investment_stats(request, business_id):
    """Get investment statistics for a specific business"""
    try:
        business = get_object_or_404(Business, id=business_id)
        investments = Investment.objects.filter(business=business)
        
        total_invested = investments.aggregate(total=models.Sum('amount'))['total'] or 0
        total_investors = investments.count()
        
        # Get recent investments
        recent_investments = investments.order_by('-invested_at')[:5]
        recent_serializer = InvestmentSerializer(recent_investments, many=True)
        
        return Response({
            'total_invested': float(total_invested),
            'total_investors': total_investors,
            'recent_investments': recent_serializer.data
        })
    except Business.DoesNotExist:
        return Response(
            {'error': f'Business with ID {business_id} not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_investments(request):
    """Get recent investments for businesses owned by the current user"""
    try:
        # Get businesses owned by the current user
        user_businesses = Business.objects.filter(user=request.user)
        
        # Get recent investments in those businesses
        recent_investments = Investment.objects.filter(
            business__in=user_businesses
        ).select_related('user', 'business').order_by('-invested_at')[:10]
        
        # Enhance the data with user and business information
        enhanced_data = []
        for investment in recent_investments:
            enhanced_data.append({
                'id': investment.id,
                'user_name': investment.user.username,
                'user_full_name': f"{investment.user.first_name} {investment.user.last_name}".strip() or investment.user.username,
                'amount': float(investment.amount),
                'invested_at': investment.invested_at.isoformat(),
                'business_title': investment.business.title
            })
        
        return Response(enhanced_data)
    except Exception as e:
        return Response(
            {'error': f'An error occurred: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

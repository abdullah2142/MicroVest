from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from .models import Log, ProfitDistribution
from .serializers import LogSerializer, LogListSerializer, ProfitDistributionSerializer
from investments.models import Business
from investments_tracking.models import Investment
from django.db import models
from django.db.models import Q

# Create your views here.

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def log_list(request):
    """List all logs or create a new log"""
    if request.method == 'GET':
        business_id = request.query_params.get('business_id')
        if business_id:
            logs = Log.objects.filter(business_id=business_id)
        else:
            logs = Log.objects.all()
        serializer = LogListSerializer(logs, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        try:
            print("Received log creation request")
            print("Request data:", request.data)
            print("Request user:", request.user)
            
            serializer = LogSerializer(data=request.data)
            if serializer.is_valid():
                print("Serializer is valid")
                # Check if the user owns the business
                business_id = serializer.validated_data['business']
                if isinstance(business_id, int):
                    business = get_object_or_404(Business, id=business_id)
                else:
                    business = business_id
                print("Business found:", business.title)
                print("Business user:", business.user)
                print("Request user:", request.user)
                
                if business.user != request.user:
                    print("User does not own the business")
                    return Response(
                        {'error': 'You can only create logs for your own businesses'}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
                
                # Check if the business is fully funded
                if business.current_funding != business.funding_goal:
                    print("Business is not fully funded")
                    return Response(
                        {'error': 'You can only create logs for fully funded businesses'}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
                
                print("User owns the business, saving log")
                log = serializer.save()
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error in log creation: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Server error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def log_detail(request, pk):
    """Retrieve, update or delete a log"""
    log = get_object_or_404(Log, pk=pk)
    
    if request.method == 'GET':
        serializer = LogSerializer(log)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Check if the user owns the business
        if log.business.user != request.user:
            return Response(
                {'error': 'You can only update logs for your own businesses'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = LogSerializer(log, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Check if the user owns the business
        if log.business.user != request.user:
            return Response(
                {'error': 'You can only delete logs for your own businesses'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        log.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def business_logs(request, business_id):
    """Get all logs for a specific business"""
    try:
        # Check if business exists
        try:
            business = Business.objects.get(id=business_id)
        except Business.DoesNotExist:
            return Response(
                {'error': 'Business not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if user owns the business or has invested in it
        user_owns_business = business.user == request.user
        user_has_invested = Investment.objects.filter(
            business=business, 
            user=request.user
        ).exists()
        
        if not user_owns_business and not user_has_invested:
            return Response(
                {'error': 'Access denied. You must own or have invested in this business to view logs.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        logs = Log.objects.filter(business=business).order_by('-year', '-month', '-created_at')
        serializer = LogSerializer(logs, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'An error occurred: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_logs(request):
    """Get recent logs for businesses owned by the current user"""
    try:
        # Get businesses owned by the current user
        user_businesses = Business.objects.filter(user=request.user)
        
        # Get recent logs from those businesses
        recent_logs = Log.objects.filter(
            business__in=user_businesses
        ).select_related('business').order_by('-created_at')[:10]
        
        # Enhance the data with business information
        enhanced_data = []
        for log in recent_logs:
            enhanced_data.append({
                'id': log.id,
                'title': log.title,
                'content': log.content,
                'created_at': log.created_at.isoformat(),
                'business_title': log.business.title
            })
        
        return Response(enhanced_data)
    except Exception as e:
        return Response(
            {'error': f'An error occurred: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_businesses_logs(request):
    """Get all logs for businesses owned by the current user"""
    try:
        # Get businesses owned by the current user
        user_businesses = Business.objects.filter(user=request.user)
        
        # Get all logs from those businesses
        logs = Log.objects.filter(business__in=user_businesses)
        serializer = LogSerializer(logs, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'An error occurred: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def distribute_profit(request, log_id):
    """Distribute profit to investors based on their investment percentage"""
    log = get_object_or_404(Log, pk=log_id)
    
    # Check if the user owns the business
    if log.business.user != request.user:
        return Response(
            {'error': 'You can only distribute profits for your own businesses'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Check if profit has already been distributed
    if log.profit_distributed > 0:
        return Response(
            {'error': 'Profit has already been distributed for this log'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get all investments for this business
    investments = Investment.objects.filter(business=log.business)
    total_invested = investments.aggregate(total=models.Sum('amount'))['total'] or 0
    
    if total_invested == 0:
        return Response(
            {'error': 'No investments found for this business'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Calculate profit distribution for each investor
    distributions = []
    total_distributed = 0
    
    for investment in investments:
        # Calculate investor's percentage of total investment
        investor_percentage = (investment.amount / total_invested) * 100
        
        # Calculate profit share for this investor
        profit_share = (log.profit_generated * investor_percentage) / 100
        
        # Create profit distribution record
        distribution = ProfitDistribution.objects.create(
            log=log,
            investment=investment,
            user=investment.user,
            amount_distributed=profit_share,
            distribution_percentage=investor_percentage
        )
        
        # Update user's fund balance
        investment.user.fund += profit_share
        investment.user.save(update_fields=['fund'])
        
        distributions.append(distribution)
        total_distributed += profit_share
    
    # Update log with distribution details
    log.profit_distributed = total_distributed
    log.profit_distribution_date = timezone.now()
    log.save(update_fields=['profit_distributed', 'profit_distribution_date'])
    
    # Return distribution details
    distribution_serializer = ProfitDistributionSerializer(distributions, many=True)
    
    return Response({
        'message': 'Profit distributed successfully',
        'total_distributed': float(total_distributed),
        'distributions': distribution_serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profit_distributions_dashboard(request):
    """
    Returns all profit distributions for the current user:
    - as_owner: distributions from businesses the user owns
    - as_investor: distributions the user received
    """
    user = request.user
    # As owner: logs from businesses the user owns
    owner_logs = Log.objects.filter(business__user=user)
    owner_distributions = ProfitDistribution.objects.filter(log__in=owner_logs)
    # As investor: distributions where user is recipient
    investor_distributions = ProfitDistribution.objects.filter(user=user)
    
    owner_data = ProfitDistributionSerializer(owner_distributions, many=True).data
    investor_data = ProfitDistributionSerializer(investor_distributions, many=True).data
    return Response({
        'as_owner': owner_data,
        'as_investor': investor_data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def next_month_year(request):
    """Get the next available month and year for a business"""
    try:
        business_id = request.GET.get('business')
        if not business_id:
            return Response(
                {'error': 'Business ID is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if business exists and user owns it
        try:
            business = Business.objects.get(id=business_id, user=request.user)
        except Business.DoesNotExist:
            return Response(
                {'error': 'Business not found or access denied'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        next_month, next_year = Log.get_next_month_year(business_id)
        
        return Response({
            'month': next_month,
            'year': next_year
        })
    except Exception as e:
        return Response(
            {'error': f'An error occurred: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_log(request):
    """Create a new log"""
    try:
        # Check if business exists and user owns it
        business_id = request.data.get('business')
        if not business_id:
            return Response(
                {'error': 'Business ID is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            business = Business.objects.get(id=business_id, user=request.user)
        except Business.DoesNotExist:
            return Response(
                {'error': 'Business not found or access denied'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if log already exists for this month/year
        month = request.data.get('month')
        year = request.data.get('year')
        if month and year:
            existing_log = Log.objects.filter(
                business=business, 
                month=month, 
                year=year
            ).first()
            if existing_log:
                return Response(
                    {'error': f'A log for {existing_log.get_month_display()} {year} already exists for this business'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        serializer = LogSerializer(data=request.data)
        if serializer.is_valid():
            try:
                log = serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response(
                    {'error': f'Error saving log: {str(e)}'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(
                {'error': 'Validation failed', 'details': serializer.errors}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        return Response(
            {'error': f'An error occurred: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

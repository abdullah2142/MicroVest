from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import EntrepreneurProfile
from .serializers import EntrepreneurProfileMetricsSerializer

# Create your views here.

class EntrepreneurProfileMetricsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = EntrepreneurProfile.objects.get(user=request.user)
        except EntrepreneurProfile.DoesNotExist:
            return Response({'detail': 'Profile not found.'}, status=404)
        serializer = EntrepreneurProfileMetricsSerializer(profile)
        return Response(serializer.data)

class EntrepreneurProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        try:
            profile = EntrepreneurProfile.objects.get(user=request.user)
        except EntrepreneurProfile.DoesNotExist:
            return Response({'detail': 'Profile not found.'}, status=404)
        
        # Update fields that can be modified by the user
        updateable_fields = [
            'annual_revenue', 'total_assets', 'company_name', 
            'business_website', 'industry', 'years_of_experience',
            'phone_number', 'linkedin_profile', 'twitter_handle',
            'preferred_investment_range', 'preferred_industries'
        ]
        
        for field in updateable_fields:
            if field in request.data:
                setattr(profile, field, request.data[field])
        
        profile.save()
        serializer = EntrepreneurProfileMetricsSerializer(profile)
        return Response(serializer.data)

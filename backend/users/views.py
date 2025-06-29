from django.shortcuts import render

# Create your views here.
# blossomvest_backend/users/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated # Allows unauthenticated users to access these views
from rest_framework_simplejwt.tokens import RefreshToken # Used for generating JWTs
from django.conf import settings
import os

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal # Import Decimal for accurate money calculations
from django.db import transaction # Import transaction for atomicity

from .serializers import UserRegisterSerializer, UserLoginSerializer, UserProfileUpdateSerializer
from .models import CustomUser # <--- ENSURE CustomUser IS IMPORTED HERE

# Helper function to generate JWT tokens for a given user
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all() # Specifies the model this view operates on
    serializer_class = UserRegisterSerializer # Links to your registration serializer
    permission_classes = [AllowAny] # No authentication required to register

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True) # Raise an error if validation fails
        user = serializer.save() # Create the user using the serializer's create method

        # Optional: You could generate tokens immediately upon registration here
        # tokens = get_tokens_for_user(user) 

        return Response({
            "message": "User Registered Successfully",
            # "tokens": tokens, # Uncomment if you want tokens immediately after registration
        }, status=status.HTTP_201_CREATED) # 201 status for successful creation

class UserLoginView(APIView):
    permission_classes = [AllowAny] # No authentication required to log in

    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True) # Validate incoming login data
        user = serializer.validated_data['user'] # Get the authenticated user object from serializer

        tokens = get_tokens_for_user(user) # Generate access and refresh tokens for the user

        return Response({
            "message": "Login Successful",
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "user_type": user.user_type,
            "tokens": tokens,
        }, status=status.HTTP_200_OK) # 200 status for successful login

class UserProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated] # Requires authentication

    def put(self, request, *args, **kwargs):
        serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            "message": "Profile Updated Successfully",
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.phone_number,
            "user_type": user.user_type,
        }, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated] # Requires authentication

    def get(self, request, *args, **kwargs):
        user = request.user
        profile_picture_url = None
        
        if user.prof_pic:
            profile_picture_url = request.build_absolute_uri(user.prof_pic.url)

        return Response({
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.phone_number,
            "user_type": user.user_type,
            "prof_pic": profile_picture_url,
        }, status=status.HTTP_200_OK)

class UserProfilePictureUploadView(APIView):
    permission_classes = [IsAuthenticated] # Requires authentication

    def post(self, request, *args, **kwargs):
        try:
            # Check if profile_picture is in the request
            if 'profile_picture' not in request.FILES:
                return Response({
                    'error': 'No profile picture provided'
                }, status=status.HTTP_400_BAD_REQUEST)

            profile_picture = request.FILES['profile_picture']
            
            # Validate file type
            allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
            if profile_picture.content_type not in allowed_types:
                return Response({
                    'error': 'Invalid file type. Please upload a JPEG, PNG, or GIF image.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Validate file size (max 5MB)
            if profile_picture.size > 5 * 1024 * 1024:
                return Response({
                    'error': 'File size too large. Please upload an image smaller than 5MB.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Delete old profile picture if it exists
            if request.user.prof_pic:
                try:
                    old_pic_path = request.user.prof_pic.path
                    if os.path.exists(old_pic_path):
                        os.remove(old_pic_path)
                except Exception as e:
                    print(f"Error deleting old profile picture: {e}")

            # Save new profile picture
            request.user.prof_pic = profile_picture
            request.user.save()

            # Return the URL of the uploaded image
            profile_picture_url = request.build_absolute_uri(request.user.prof_pic.url)

            return Response({
                'message': 'Profile picture uploaded successfully',
                'profile_picture_url': profile_picture_url
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'An error occurred while uploading the profile picture: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class AddFundView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        amount_str = request.data.get('amount')

        if amount_str is None:
            return Response({"error": "Amount is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Convert the amount to Decimal for precise financial calculations
            amount = Decimal(amount_str)
            if amount <= 0:
                return Response({"error": "Amount must be a positive number."}, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError):
            return Response({"error": "Invalid amount format."}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user # The authenticated user instance

        # Use a database transaction to ensure atomicity
        # This prevents race conditions if multiple requests try to update the fund simultaneously
        with transaction.atomic():
            # Re-fetch the user within the transaction to get the latest fund value
            # This is important for preventing race conditions if user fund is updated elsewhere
            user.refresh_from_db() 
            user.fund += amount
            user.save()

        # You can return the updated fund or a success message
        return Response({
            "message": f"Successfully added {amount:.2f} to your fund.",
            "new_fund_total": str(user.fund) # Convert Decimal to string for JSON serialization
        }, status=status.HTTP_200_OK)

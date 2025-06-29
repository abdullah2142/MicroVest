from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)
    password2 = serializers.CharField(write_only = True)

    class Meta:
        model = CustomUser
        fields = ['username','email', 'first_name' , 'last_name', 'user_type', 'phone_number','password','password2']
        extra_kwargs = {'password': {'write_only': True}} 

    # Custom validation
    def validate(self,data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data
    
    # For creating new users
    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'), 
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),  
            last_name=validated_data.get('last_name', ''), 
            user_type=validated_data.get('user_type', 'investor'), 
        )

        return user
    
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self,data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid Credentials')
        else:
            raise serializers.ValidationError('Must provide username and password')
            
        data['user'] = user
        return data

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'phone_number']
        read_only_fields = ['username', 'user_type'] # These fields cannot be changed

        # users/serializers.py
from rest_framework import serializers
from .models import CustomUser
# from investors.serializers import InvestorProfileSerializer # If you want to nest the profile

class CustomUserSerializer(serializers.ModelSerializer):
    # If InvestorProfile is always linked and you want its data directly here:
    # total_investments_count = serializers.IntegerField(source='investor_profile.total_investments_count', read_only=True)
    # total_money_invested = serializers.DecimalField(max_digits=12, decimal_places=2, source='investor_profile.total_money_invested', read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'username', 'first_name', 'last_name', 'email', 'user_type', 'fund', 'prof_pic',
            # Add these if you're fetching from CustomUserSerializer directly:
            # 'total_investments_count', 'total_money_invested'
        ]
        read_only_fields = ['username', 'email', 'user_type', 'fund', 'total_investments_count', 'total_money_invested']
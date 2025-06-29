# investments/serializers.py
from rest_framework import serializers
from .models import Business, BusinessImage, BusinessVideo, BusinessDocument, CalendarEvent, SavedBusiness
from investments_tracking.models import Investment

# --- Serializers for creating/uploading related files ---
class BusinessImageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessImage
        fields = ['image', 'order'] # 'image' field for file upload

class BusinessVideoCreateSerializer(serializers.ModelSerializer):
    # 'video_file' for the actual video, 'thumbnail' for its image
    class Meta:
        model = BusinessVideo
        fields = ['title', 'video_file', 'thumbnail', 'duration']

class BusinessDocumentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessDocument
        fields = ['name', 'document_file', 'size'] # 'document_file' for file upload

class SavedBusinessSerializer(serializers.ModelSerializer):
    business = serializers.PrimaryKeyRelatedField(queryset=Business.objects.all())
    
    class Meta:
        model = SavedBusiness
        fields = ['id', 'business', 'saved_at']
        read_only_fields = ['id', 'saved_at']

class SavedBusinessListSerializer(serializers.ModelSerializer):
    business = serializers.SerializerMethodField()
    
    class Meta:
        model = SavedBusiness
        fields = ['id', 'business', 'saved_at']
    
    def get_business(self, obj):
        # Return basic business info for the saved business
        business = obj.business
        return {
            'id': business.id,
            'title': business.title,
            'category': business.category,
            'location': business.location,
            'funding_goal': business.funding_goal,
            'current_funding': business.current_funding,
            'backers': business.backers,
            'image': business.images.first().image.url if business.images.exists() else None,
        }

# --- Main serializer for creating a new Business Pitch ---
class BusinessPitchSerializer(serializers.ModelSerializer):
    # Use nested serializers for writable nested relationships
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )
    videos = serializers.ListField(
        child=serializers.FileField(), write_only=True, required=False
    )
    documents = serializers.ListField(
        child=serializers.FileField(), write_only=True, required=False
    )

    class Meta:
        model = Business
        # Fields that come directly from the frontend formData
        fields = [
            'title', 'tagline', 'description', 'category', 'location',
            'funding_goal', 'min_investment',
            'team_size', 'website', 'social_media', 'entrepreneur_name',
            'business_plan', 'financial_projections', 'market_analysis',
            'competitive_advantage', 'use_of_funds',
            'founding_year', 'industry_experience', 'key_achievements',
            'target_market_size', 'revenue_model', 'growth_metrics',
            'user', 'created_at', 'updated_at',
            'images', 'videos', 'documents' # Include nested fields
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    # Override create method to handle nested writes for images, videos, and documents
    def create(self, validated_data):
        # Extract file data from request
        request = self.context.get('request')
        images_data = request.FILES.getlist('images') if request else []
        videos_data = request.FILES.getlist('videos') if request else []
        documents_data = request.FILES.getlist('documents') if request else []

        # Remove nested fields from validated_data
        validated_data.pop('images', None)
        validated_data.pop('videos', None)
        validated_data.pop('documents', None)

        # Create the business
        business = Business.objects.create(**validated_data)

        # Create related files
        for image_data in images_data:
            BusinessImage.objects.create(business=business, image=image_data)
        for video_data in videos_data:
            BusinessVideo.objects.create(business=business, video_file=video_data, title=video_data.name)
        for document_data in documents_data:
            BusinessDocument.objects.create(business=business, document_file=document_data, name=document_data.name)
            
        return business


# --- Existing serializers for displaying business data (modified to use FileField URLs) ---
class BusinessImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = BusinessImage
        fields = ['image_url', 'order']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None

class BusinessVideoSerializer(serializers.ModelSerializer):
    thumbnail_url = serializers.SerializerMethodField() # Frontend expects 'thumbnail_url'
    video_file_url = serializers.SerializerMethodField() # Add URL for video file

    class Meta:
        model = BusinessVideo
        fields = ['title', 'thumbnail_url', 'video_file_url', 'duration']

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            return self.context['request'].build_absolute_uri(obj.thumbnail.url)
        return self.context['request'].build_absolute_uri('/static/img/video_placeholder.png')

    def get_video_file_url(self, obj):
        if obj.video_file:
            return self.context['request'].build_absolute_uri(obj.video_file.url)
        return None

class BusinessDocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField() # Frontend expects 'file_url'

    class Meta:
        model = BusinessDocument
        fields = ['name', 'file_url', 'size']

    def get_file_url(self, obj):
        if obj.document_file:
            return self.context['request'].build_absolute_uri(obj.document_file.url)
        return None

# BusinessListSerializer and BusinessDetailSerializer need context passed to them
# in views to generate absolute URLs for image/file fields.

class BusinessListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    user_investment_amount = serializers.SerializerMethodField()
    user_investment_percentage = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Business
        fields = [
            'id', 'title', 'description', 'category', 'location',
            'funding_goal', 'current_funding', 'backers',
            'min_investment', 'image', 'user', 'user_investment_amount', 'user_investment_percentage', 'is_saved'
        ]

    def get_image(self, obj):
        first_image = obj.images.first()
        if first_image and first_image.image:
            # Requires 'request' in serializer context
            return self.context['request'].build_absolute_uri(first_image.image.url)
        # Return a simple placeholder path
        return "/placeholder.svg"

    def get_user_investment_amount(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                investment = Investment.objects.get(user=request.user, business=obj)
                return float(investment.amount)
            except Investment.DoesNotExist:
                return 0
        return 0

    def get_user_investment_percentage(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                investment = Investment.objects.get(user=request.user, business=obj)
                if obj.funding_goal > 0:
                    return round((float(investment.amount) / float(obj.funding_goal)) * 100, 2)
                return 0
            except Investment.DoesNotExist:
                return 0
        return 0

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedBusiness.objects.filter(user=request.user, business=obj).exists()
        return False

class BusinessDetailSerializer(serializers.ModelSerializer):
    images = BusinessImageSerializer(many=True, read_only=True)
    videos = BusinessVideoSerializer(many=True, read_only=True)
    documents = BusinessDocumentSerializer(many=True, read_only=True)
    entrepreneur_full_name = serializers.SerializerMethodField()
    entrepreneur_user_id = serializers.SerializerMethodField()
    user_investment_amount = serializers.SerializerMethodField()
    user_investment_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Business
        fields = '__all__'

    def get_entrepreneur_full_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip()
        # Fallback to entrepreneur_name field if user is not set, or provide a default
        if obj.entrepreneur_name:
            return obj.entrepreneur_name
        return "Unknown Entrepreneur"

    def get_entrepreneur_user_id(self, obj):
        if obj.user:
            return obj.user.id
        return None

    def get_user_investment_amount(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                investment = Investment.objects.get(user=request.user, business=obj)
                return float(investment.amount)
            except Investment.DoesNotExist:
                return 0
        return 0

    def get_user_investment_percentage(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                investment = Investment.objects.get(user=request.user, business=obj)
                if obj.funding_goal > 0:
                    return round((float(investment.amount) / float(obj.funding_goal)) * 100, 2)
                return 0
            except Investment.DoesNotExist:
                return 0
        return 0

class InvestmentSerializer(serializers.Serializer):
    """
    Serializer for handling investment actions.
    Receives business ID and investment amount.
    """
    business_id = serializers.IntegerField(write_only=True, required=True)
    investment_amount = serializers.DecimalField(
        max_digits=10, decimal_places=2, write_only=True, required=True,
        min_value=1 # Ensure a positive investment
    )

    def validate(self, data):
        """
        Check if the business exists and if the investment amount is valid.
        """
        try:
            business = Business.objects.get(id=data['business_id'])
        except Business.DoesNotExist:
            raise serializers.ValidationError("Business not found.")

        # Check if the current user is the owner of the business
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if business.user == request.user:
                raise serializers.ValidationError("You cannot invest in your own business.")

        # Ensure investment doesn't exceed the remaining goal
        remaining_goal = business.funding_goal - business.current_funding
        if data['investment_amount'] > remaining_goal:
            # We want to allow investing up to the remaining goal if user inputs more
            # This validation will prevent over-investing past the goal
            raise serializers.ValidationError(
                f"Investment amount exceeds the remaining funding goal of {remaining_goal:.0f}."
            )
        # If unlimited money is allowed (as per prompt), no need to check user's balance here.

        data['business'] = business # Attach business object to validated_data for easy access in save/view
        return data

    def create(self, validated_data):
        # This serializer doesn't create a new model instance directly,
        # but performs an update. We will handle the update in the view.
        # Or, we can override save() here. Let's do it in the view for clarity.
        pass

    def save(self, **kwargs):
        """
        Performs the update to the Business instance.
        """
        business = self.validated_data['business']
        investment_amount = self.validated_data['investment_amount']

        business.current_funding += investment_amount
        business.backers += 1 # Increment backer count for each investment
        business.save(update_fields=['current_funding', 'backers']) # Only update these fields

        # We need to return something that the view can serialize back to the frontend.
        # Let's return the updated business data for the frontend to refresh its view.
        # Create a dictionary representing the updated fields.
        return {
            'id': business.id,
            'current_funding': business.current_funding,
            'backers': business.backers,
            'funding_goal': business.funding_goal # Also send goal for progress bar
        }

class CalendarEventSerializer(serializers.ModelSerializer):
    business_title = serializers.CharField(source='business.title', read_only=True)
    event_type_display = serializers.CharField(source='get_event_type_display', read_only=True)
    
    class Meta:
        model = CalendarEvent
        fields = [
            'id', 'business', 'business_title', 'title', 'description', 
            'event_type', 'event_type_display', 'date', 'time', 
            'duration_minutes', 'location', 'is_completed', 'created_at'
        ]
        read_only_fields = ['created_at']
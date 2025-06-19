# investments/serializers.py
from rest_framework import serializers
from .models import Business, BusinessImage, BusinessVideo, BusinessDocument

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

# --- Main serializer for creating a new Business Pitch ---
class BusinessPitchSerializer(serializers.ModelSerializer):
    # Use nested serializers for writable nested relationships
    images = BusinessImageCreateSerializer(many=True, required=False)
    videos = BusinessVideoCreateSerializer(many=True, required=False)
    documents = BusinessDocumentCreateSerializer(many=True, required=False)

    class Meta:
        model = Business
        # Fields that come directly from the frontend formData
        fields = [
            'title', 'tagline', 'description', 'category', 'location',
            'funding_goal', 'min_investment',
            'team_size', 'website', 'social_media','entrepreneur_name',
            'business_plan', 'financial_projections', 'market_analysis',
            'competitive_advantage', 'use_of_funds',
            'images', 'videos', 'documents' # Include nested fields
        ]

    # Override create method to handle nested writes for images, videos, and documents
    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        videos_data = validated_data.pop('videos', [])
        documents_data = validated_data.pop('documents', [])

        business = Business.objects.create(**validated_data)

        for i, image_data in enumerate(images_data):
            BusinessImage.objects.create(business=business, **image_data, order=i)

        for video_data in videos_data:
            BusinessVideo.objects.create(business=business, **video_data)

        for document_data in documents_data:
            BusinessDocument.objects.create(business=business, **document_data)

        return business


# --- Existing serializers for displaying business data (modified to use FileField URLs) ---
class BusinessImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField() # Frontend expects 'image_url'

    class Meta:
        model = BusinessImage
        fields = ['image_url', 'order']

    def get_image_url(self, obj):
        # Return the absolute URL for the image file
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
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

    class Meta:
        model = Business
        fields = [
            'id', 'title', 'description', 'category', 'location',
            'funding_goal', 'current_funding', 'backers',
            'min_investment', 'image'
        ]

    def get_image(self, obj):
        first_image = obj.images.first()
        if first_image and first_image.image:
            # Requires 'request' in serializer context
            return self.context['request'].build_absolute_uri(first_image.image.url)
        return "/placeholder.svg"


class BusinessDetailSerializer(serializers.ModelSerializer):
    images = BusinessImageSerializer(many=True, read_only=True)
    videos = BusinessVideoSerializer(many=True, read_only=True)
    documents = BusinessDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Business
        fields = '__all__'

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
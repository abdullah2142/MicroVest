from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Business(models.Model):
    # Core Information
    title = models.CharField(max_length=255)
    entrepreneur_name = models.CharField(max_length=255, blank=True, null=True)
    tagline = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    funding_goal = models.DecimalField(max_digits=10, decimal_places=2)
    current_funding = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    backers = models.IntegerField(default=0)
    min_investment = models.DecimalField(max_digits=10, decimal_places=2)
    team_size = models.IntegerField(default=0)
    website = models.URLField(blank=True, null=True)
    social_media = models.CharField(max_length=100, blank=True, null=True)
    
    # User ownership
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='businesses', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Detailed Information (from BusinessDetailPage)
    business_plan = models.TextField(blank=True, null=True)
    financial_projections = models.TextField(blank=True, null=True)
    market_analysis = models.TextField(blank=True, null=True)
    competitive_advantage = models.TextField(blank=True, null=True)
    use_of_funds = models.TextField(blank=True, null=True)

    # Quick Facts
    founding_year = models.IntegerField(blank=True, null=True)
    industry_experience = models.CharField(max_length=255, blank=True, null=True)
    key_achievements = models.TextField(blank=True, null=True)
    target_market_size = models.CharField(max_length=255, blank=True, null=True)
    revenue_model = models.CharField(max_length=255, blank=True, null=True)
    growth_metrics = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

class SavedBusiness(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_businesses')
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='saved_by_users')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'business']
        ordering = ['-saved_at']

    def __str__(self):
        return f"{self.user.username} saved {self.business.title}"

class BusinessImage(models.Model):
    business = models.ForeignKey(Business, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='business_images/',blank=True, null=True)
    order = models.PositiveIntegerField(default=0) # To maintain order of images

    class Meta:
        ordering = ['order']

class BusinessVideo(models.Model):
    business = models.ForeignKey(Business, related_name='videos', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    video_file = models.FileField(upload_to='business_videos/',blank=True, null=True) 
    thumbnail = models.ImageField(upload_to='business_thumbnails/',blank=True, null=True)
    duration = models.CharField(max_length=20) # e.g., "3:45"

class BusinessDocument(models.Model):
    business = models.ForeignKey(Business, related_name='documents', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    document_file = models.FileField(upload_to='business_documents/',blank=True, null=True ) # Changed to FileField
    size = models.CharField(max_length=50, blank=True, null=True)

class CalendarEvent(models.Model):
    EVENT_TYPES = [
        ('meeting', 'Meeting'),
        ('deadline', 'Deadline'),
        ('pitch', 'Pitch'),
        ('milestone', 'Milestone'),
        ('other', 'Other'),
    ]
    
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='calendar_events')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='other')
    date = models.DateField()
    time = models.TimeField(null=True, blank=True)
    duration_minutes = models.IntegerField(default=60)
    location = models.CharField(max_length=200, blank=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['date', 'time']
    
    def __str__(self):
        return f"{self.title} - {self.date}" 
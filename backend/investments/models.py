from django.db import models

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

    # Detailed Information (from BusinessDetailPage)
    business_plan = models.TextField(blank=True, null=True)
    financial_projections = models.TextField(blank=True, null=True)
    market_analysis = models.TextField(blank=True, null=True)
    competitive_advantage = models.TextField(blank=True, null=True)
    use_of_funds = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

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
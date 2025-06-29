from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class EntrepreneurProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='entrepreneur_profile')
    
    # Personal Information
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='entrepreneur_profiles/', blank=True, null=True)
    
    # Business Information
    company_name = models.CharField(max_length=200, blank=True, null=True)
    business_website = models.URLField(blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    
    # Financial Information
    annual_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_assets = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    credit_score = models.PositiveIntegerField(
        validators=[MinValueValidator(300), MaxValueValidator(850)],
        blank=True, null=True
    )
    
    # Business Metrics
    total_businesses_created = models.PositiveIntegerField(default=0)
    total_funding_raised = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_investors = models.PositiveIntegerField(default=0)
    total_profit_generated = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Performance Metrics
    success_rate = models.DecimalField(
        max_digits=5, decimal_places=2, 
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        default=0,
        help_text="Success rate as a percentage"
    )
    average_investment_size = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Verification Status
    is_verified = models.BooleanField(default=False)
    verification_date = models.DateTimeField(blank=True, null=True)
    
    # Social Media & Networking
    linkedin_profile = models.URLField(blank=True, null=True)
    twitter_handle = models.CharField(max_length=50, blank=True, null=True)
    
    # Preferences
    preferred_investment_range = models.CharField(max_length=50, blank=True, null=True)
    preferred_industries = models.JSONField(default=list, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Entrepreneur Profile"
        verbose_name_plural = "Entrepreneur Profiles"
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.company_name or 'Entrepreneur'}"
    
    @property
    def full_name(self):
        return self.user.get_full_name() or self.user.username
    
    @property
    def email(self):
        return self.user.email
    
    def calculate_success_rate(self):
        """Calculate success rate based on completed vs total businesses"""
        if self.total_businesses_created == 0:
            return 0
        # This would need to be implemented based on business completion logic
        return 0
    
    def update_metrics(self):
        """Update business metrics from related businesses"""
        from investments.models import Business
        
        businesses = Business.objects.filter(entrepreneur_name=self.user.get_full_name())
        
        self.total_businesses_created = businesses.count()
        self.total_funding_raised = sum(business.current_funding for business in businesses)
        self.total_investors = sum(business.backers for business in businesses)
        
        # Calculate total profit from logs
        from logs.models import Log
        logs = Log.objects.filter(business__in=businesses)
        self.total_profit_generated = sum(log.profit_generated for log in logs if log.profit_generated)
        
        # Calculate average investment size
        if self.total_investors > 0:
            self.average_investment_size = self.total_funding_raised / self.total_investors
        
        self.save()

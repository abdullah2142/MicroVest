from django.db import models
from django.conf import settings # To link to your CustomUser model

class Business(models.Model):
    # Choices for ENUM fields
    BUSINESS_STRUCTURE_CHOICES = [
        ('LLC', 'Limited Liability Company (LLC)'),
        ('Corporation', 'Corporation'),
        ('Sole Proprietorship', 'Sole Proprietorship'),
        ('Partnership', 'Partnership'),
    ]

    BUSINESS_STATUS_CHOICES = [
        ('active', 'Active'),
        ('closed', 'Closed'),
        ('suspended', 'Suspended'),
    ]

    # Foreign Key to link to the entrepreneur (CustomUser model)
    # The entrepreneur_id from your SQL becomes 'entrepreneur' here.
    # on_delete=models.CASCADE means if the entrepreneur is deleted, their businesses are also deleted.
    entrepreneur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_businesses', # Allows you to access `user.owned_businesses.all()`
        help_text="The entrepreneur who owns this business."
    )

    business_name = models.CharField(max_length=100, unique=True, help_text="The official name of the business.")
    business_structure = models.CharField(
        max_length=20,
        choices=BUSINESS_STRUCTURE_CHOICES,
        help_text="Legal structure of the business (e.g., LLC, Corporation)."
    )
    industry_category = models.CharField(max_length=100, help_text="Category of industry the business operates in (e.g., Tech, Retail, Food).")
    funding_goal = models.DecimalField(max_digits=15, decimal_places=2, help_text="Total amount of funding the business aims to raise.")
    current_funding = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, help_text="Amount of funding raised so far.")
    minimum_investment = models.DecimalField(max_digits=15, decimal_places=2, help_text="Minimum amount an investor can contribute.")
    employee_count = models.IntegerField(default=0, help_text="Number of employees working for the business.")
    address = models.TextField(help_text="Physical address of the business.")
    city = models.CharField(max_length=100, help_text="City where the business is located.")
    country = models.CharField(max_length=100, help_text="Country where the business is located.")
    website_url = models.URLField(max_length=255, blank=True, null=True, help_text="Official website URL of the business.")
    business_description = models.TextField(help_text="Detailed description of the business, its mission, and operations.")
    historical_revenue = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True, help_text="Past revenue figures (e.g., last fiscal year).")
    projected_revenue = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True, help_text="Expected future revenue projections.")
    current_valuation = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True, help_text="Current estimated valuation of the business.")
    business_status = models.CharField(
        max_length=10,
        choices=BUSINESS_STATUS_CHOICES,
        default='active',
        help_text="Current operational status of the business."
    )
    launch_date = models.DateField(blank=True, null=True, help_text="Date the business was officially launched.")
    next_report_due = models.DateField(blank=True, null=True, help_text="Date when the next progress or financial report is due.")

    # Automatic Timestamps (Django handles these beautifully)
    created_at = models.DateTimeField(auto_now_add=True, help_text="Timestamp when the business record was created.")
    updated_at = models.DateTimeField(auto_now=True, help_text="Timestamp of the last update to the business record.")

    class Meta:
        verbose_name_plural = "Businesses" # Correct plural name for admin interface
        ordering = ['-created_at'] # Default ordering, e.g., newest businesses first

    def __str__(self):
        return self.business_name
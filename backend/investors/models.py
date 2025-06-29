# investors/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from users.models import CustomUser # Assuming CustomUser is in a 'users' app

class Industry(models.Model):
    """
    Represents a category or sector of industry.
    """
    name = models.CharField(max_length=100, unique=True,
                            help_text="Name of the industry (e.g., 'Technology', 'Healthcare').")
    description = models.TextField(blank=True, null=True,
                                   help_text="A brief description of the industry.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Industries" # Correct pluralization for 'Industry'
        ordering = ['name'] # Order industries alphabetically by name

    def __str__(self):
        return self.name

class InvestorProfile(models.Model):
    """
    Stores additional profile information for investor users.
    """
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='investor_profile',
        limit_choices_to={'user_type': 'investor'},
        help_text="The CustomUser associated with this investor profile."
    )
    bio = models.TextField(blank=True, null=True,
                           help_text="A brief biography of the investor.")
    investment_focus = models.ManyToManyField(
        Industry,
        blank=True,
        related_name='investors',
        help_text="The industries the investor is interested in."
    )
    min_investment = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text="Minimum investment amount the investor considers."
    )
    max_investment = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text="Maximum investment amount the investor considers."
    )
    website = models.URLField(max_length=200, blank=True, null=True,
                              help_text="Investor's personal or company website.")
    linkedin_profile = models.URLField(max_length=200, blank=True, null=True,
                                      help_text="Link to the investor's LinkedIn profile.")

    # ADD THESE NEW FIELDS:
    RISK_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )
    risk_tolerance = models.CharField(
        max_length=10,
        choices=RISK_CHOICES,
        default='medium',
        blank=True,
        null=True,
        help_text="Investor's tolerance for risk."
    )
    ACCREDITED_CHOICES = (
        ('yes', 'Yes'),
        ('no', 'No'),
        ('pending', 'Pending'),
    )
    current_fund = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text='Current available funds for the investor to deploy.'
    )
    accredited_investor_status = models.CharField(
        max_length=10,
        choices=ACCREDITED_CHOICES,
        default='no',
        help_text="Accredited investor status."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Investor Profile for {self.user.name}"

    @property
    def get_investment_focus_names(self):
        return ", ".join([industry.name for industry in self.investment_focus.all()])


from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from investments.models import Business
from investments_tracking.models import Investment
from decimal import Decimal
from datetime import datetime

User = get_user_model()

class Log(models.Model):
    MONTH_CHOICES = [
        (1, 'January'), (2, 'February'), (3, 'March'), (4, 'April'),
        (5, 'May'), (6, 'June'), (7, 'July'), (8, 'August'),
        (9, 'September'), (10, 'October'), (11, 'November'), (12, 'December')
    ]
    
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='logs')
    title = models.CharField(max_length=200, blank=True, null=True)
    content = models.TextField()
    fund_usage = models.TextField(blank=True, null=True, help_text="How the funds are being used")
    progress_update = models.TextField(blank=True, null=True, help_text="Progress made with the funds")
    achievements = models.TextField(blank=True, null=True, help_text="Key achievements and milestones")
    challenges = models.TextField(blank=True, null=True, help_text="Challenges faced and how they were overcome")
    next_steps = models.TextField(blank=True, null=True, help_text="Planned next steps")
    financial_update = models.TextField(blank=True, null=True, help_text="Financial performance and metrics")
    
    # Month and Year fields
    month = models.IntegerField(choices=MONTH_CHOICES, null=True, blank=True, help_text="Month of the report")
    year = models.IntegerField(null=True, blank=True, help_text="Year of the report")
    
    # Financial fields
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text="Total revenue for this month")
    total_expense = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text="Total expenses for this month")
    
    # Profit section (calculated from revenue - expense)
    profit_generated = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text="Profit generated in this period (calculated)")
    profit_distributed = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text="Profit distributed to investors")
    profit_distribution_date = models.DateTimeField(blank=True, null=True, help_text="Date when profit was distributed")
    profit_notes = models.TextField(blank=True, null=True, help_text="Notes about profit generation and distribution")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-year', '-month', '-created_at']
        unique_together = ['business', 'month', 'year']  # Only one log per month per business
    
    def __str__(self):
        return f"{self.business.title} - {self.get_month_display()} {self.year} ({self.created_at.strftime('%Y-%m-%d')})"
    
    # def clean(self):
    #     """Validate that only one log exists per month per business"""
    #     if self.pk is None:  # Only check for new logs
    #         if Log.objects.filter(business=self.business, month=self.month, year=self.year).exists():
    #             raise ValidationError(f"A log for {self.get_month_display()} {self.year} already exists for this business.")
    
    def save(self, *args, **kwargs):
        """Calculate profit and auto-generate title before saving"""
        self.profit_generated = self.total_revenue - self.total_expense
        
        # Auto-generate title if not provided
        if not self.title or self.title.strip() == '':
            month_name = self.get_month_display() if self.month else 'Unknown Month'
            year = self.year if self.year else 'Unknown Year'
            self.title = f"{self.business.title} - Report - {month_name} {year}"
        
        super().save(*args, **kwargs)
    
    @property
    def profit_retained(self):
        """Calculate retained profit (generated - distributed)"""
        generated = Decimal(str(self.profit_generated or 0))
        distributed = Decimal(str(self.profit_distributed or 0))
        return generated - distributed
    
    @property
    def formatted_total_revenue(self):
        return f"${self.total_revenue:,.2f}"
    
    @property
    def formatted_total_expense(self):
        return f"${self.total_expense:,.2f}"
    
    @property
    def formatted_profit_generated(self):
        return f"${self.profit_generated:,.2f}"
    
    @property
    def formatted_profit_distributed(self):
        return f"${self.profit_distributed:,.2f}"
    
    @property
    def formatted_profit_retained(self):
        return f"${self.profit_retained:,.2f}"
    
    @classmethod
    def get_next_month_year(cls, business_id):
        """Get the next month and year for a business"""
        latest_log = cls.objects.filter(business_id=business_id).order_by('-year', '-month').first()
        
        if not latest_log:
            # If no logs exist, start with current month of 2025
            now = datetime.now()
            return now.month, 2025  # Always start with 2025
        
        # Calculate next month
        next_month = latest_log.month + 1
        next_year = latest_log.year
        
        if next_month > 12:
            next_month = 1
            next_year = 2026  # After December 2025, go to 2026
        
        return next_month, next_year

class ProfitDistribution(models.Model):
    log = models.ForeignKey(Log, on_delete=models.CASCADE, related_name='profit_distributions')
    investment = models.ForeignKey(Investment, on_delete=models.CASCADE, related_name='profit_distributions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='profit_distributions_received')
    amount_distributed = models.DecimalField(max_digits=12, decimal_places=2, help_text="Amount distributed to this investor")
    distribution_percentage = models.DecimalField(max_digits=5, decimal_places=2, help_text="Percentage of total profit distributed to this investor")
    distributed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-distributed_at']
        unique_together = ['log', 'investment']  # One distribution per log per investment
    
    def __str__(self):
        return f"{self.user.username} - ${self.amount_distributed} from {self.log.business.title}"
    
    @property
    def formatted_amount(self):
        return f"${self.amount_distributed:,.2f}"

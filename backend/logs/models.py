from django.db import models
from django.contrib.auth import get_user_model
from investments.models import Business
from investments_tracking.models import Investment
from decimal import Decimal

User = get_user_model()

class Log(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='logs')
    title = models.CharField(max_length=200)
    content = models.TextField()
    fund_usage = models.TextField(blank=True, null=True, help_text="How the funds are being used")
    progress_update = models.TextField(blank=True, null=True, help_text="Progress made with the funds")
    achievements = models.TextField(blank=True, null=True, help_text="Key achievements and milestones")
    challenges = models.TextField(blank=True, null=True, help_text="Challenges faced and how they were overcome")
    next_steps = models.TextField(blank=True, null=True, help_text="Planned next steps")
    financial_update = models.TextField(blank=True, null=True, help_text="Financial performance and metrics")
    
    # Profit section
    profit_generated = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text="Profit generated in this period")
    profit_distributed = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text="Profit distributed to investors")
    profit_distribution_date = models.DateTimeField(blank=True, null=True, help_text="Date when profit was distributed")
    profit_notes = models.TextField(blank=True, null=True, help_text="Notes about profit generation and distribution")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.business.title} - {self.title} ({self.created_at.strftime('%Y-%m-%d')})"
    
    @property
    def profit_retained(self):
        """Calculate retained profit (generated - distributed)"""
        generated = Decimal(str(self.profit_generated or 0))
        distributed = Decimal(str(self.profit_distributed or 0))
        return generated - distributed
    
    @property
    def formatted_profit_generated(self):
        return f"${self.profit_generated:,.2f}"
    
    @property
    def formatted_profit_distributed(self):
        return f"${self.profit_distributed:,.2f}"
    
    @property
    def formatted_profit_retained(self):
        return f"${self.profit_retained:,.2f}"

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

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from entrepreneurs.models import EntrepreneurProfile
from decimal import Decimal

User = get_user_model()

class Command(BaseCommand):
    help = 'Create dummy entrepreneur profile data for testing'

    def handle(self, *args, **options):
        # Get all users who don't have entrepreneur profiles yet
        users_without_profiles = User.objects.filter(entrepreneur_profile__isnull=True)
        
        if not users_without_profiles.exists():
            self.stdout.write(
                self.style.WARNING('No users found without entrepreneur profiles')
            )
            return

        for user in users_without_profiles:
            # Create entrepreneur profile with dummy data
            profile = EntrepreneurProfile.objects.create(
                user=user,
                phone_number="+1-555-0123",
                company_name=f"{user.first_name or user.username}'s Ventures",
                business_website="https://example.com",
                industry="Technology",
                years_of_experience=5,
                annual_revenue=Decimal('120000.00'),
                total_assets=Decimal('350000.00'),
                credit_score=750,
                total_businesses_created=3,
                total_funding_raised=Decimal('180000.00'),
                total_investors=47,
                total_profit_generated=Decimal('52000.00'),
                success_rate=Decimal('87.50'),
                average_investment_size=Decimal('8500.00'),
                is_verified=True,
                linkedin_profile="https://linkedin.com/in/example",
                twitter_handle="@example_entrepreneur",
                preferred_investment_range="$5,000 - $50,000",
                preferred_industries=["Technology", "Healthcare", "Fintech"]
            )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created entrepreneur profile for {user.username}'
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                f'Created {users_without_profiles.count()} entrepreneur profile(s)'
            )
        ) 
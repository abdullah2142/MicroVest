# backend/notifications/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from investments_tracking.models import Investment
from logs.models import Log, ProfitDistribution
from messaging.models import FriendRequest
from .models import Notification
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Investment)
def investment_notification(sender, instance, created, **kwargs):
    logger.info(f"Investment notification signal triggered for investment {instance.id}")
    try:
        business_owner = instance.business.user
        investor_name = instance.user.get_full_name() or instance.user.username
        
        # Calculate percentage share
        percentage_share = round((float(instance.amount) / float(instance.business.funding_goal)) * 100, 2)
        
        if created:
            # New investment
            message = f"You have a new investment of ${instance.amount} from {investor_name} in your business '{instance.business.title}'. They now own {percentage_share}% of your business."
        else:
            # Additional investment (updated)
            message = f"{investor_name} has made an additional investment of ${instance.amount} in your business '{instance.business.title}'. They now own {percentage_share}% of your business."
        
        notification = Notification.objects.create(recipient=business_owner, message=message, business=instance.business)
        logger.info(f"Notification created: {notification.id} for user {business_owner.username}")
        
        # Also notify the investor about their percentage share
        if created:
            investor_message = f"You have successfully invested ${instance.amount} in '{instance.business.title}'. You now own {percentage_share}% of this business."
        else:
            investor_message = f"You have made an additional investment of ${instance.amount} in '{instance.business.title}'. You now own {percentage_share}% of this business."
        
        investor_notification = Notification.objects.create(recipient=instance.user, message=investor_message)
        logger.info(f"Investor notification created: {investor_notification.id} for user {instance.user.username}")
        
    except Exception as e:
        logger.error(f"Error creating investment notification: {e}")

@receiver(post_save, sender=Log)
def new_log_notification(sender, instance, created, **kwargs):
    if created:
        investors = instance.business.investments_received.values_list('user', flat=True)
        for investor_id in investors:
            message = f"A new business report log is available for '{instance.business.title}'."
            Notification.objects.create(recipient_id=investor_id, message=message, business=instance.business)

@receiver(post_save, sender=ProfitDistribution)
def invoice_notification(sender, instance, created, **kwargs):
    if created:
        message = f"You have received a profit distribution of ${instance.amount_distributed} from '{instance.log.business.title}'."
        Notification.objects.create(recipient=instance.user, message=message, business=instance.log.business)

@receiver(post_save, sender=FriendRequest)
def friend_request_notification(sender, instance, created, **kwargs):
    if created:
        # Notify the recipient about the new friend request
        sender_name = instance.from_user.get_full_name() or instance.from_user.username
        message = f"{sender_name} sent you a friend request."
        Notification.objects.create(recipient=instance.to_user, message=message)
        logger.info(f"Friend request notification created for user {instance.to_user.username}")
    
    elif instance.status == 'accepted':
        # Notify both users that they are now friends
        recipient_name = instance.to_user.get_full_name() or instance.to_user.username
        sender_name = instance.from_user.get_full_name() or instance.from_user.username
        
        # Notify the recipient
        message = f"You are now friends with {sender_name}. You can start messaging them!"
        Notification.objects.create(recipient=instance.to_user, message=message)
        
        # Notify the sender
        message = f"You are now friends with {recipient_name}. You can start messaging them!"
        Notification.objects.create(recipient=instance.from_user, message=message)
        
        logger.info(f"Friend request notifications created for users {instance.from_user.username} and {instance.to_user.username}")
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import FriendRequest, Conversation
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

def create_automatic_friendship(investor_user, business_owner_user):
    """
    Automatically create a friend relationship between an investor and a business owner.
    This function handles the creation of friend requests and conversations.
    """
    try:
        logger.info(f"Creating automatic friendship between investor {investor_user.username} and business owner {business_owner_user.username}")
        
        # Check if a friend request already exists between these users
        existing_request = FriendRequest.objects.filter(
            (Q(from_user=investor_user, to_user=business_owner_user) |
             Q(from_user=business_owner_user, to_user=investor_user))
        ).first()
        
        if existing_request:
            logger.info(f"Existing friend request found: {existing_request.status}")
            # If a request exists but is not accepted, accept it
            if existing_request.status != 'accepted':
                existing_request.status = 'accepted'
                existing_request.save()
                logger.info(f"Updated existing friend request to accepted")
                
                # Create conversation if it doesn't exist
                if not Conversation.objects.filter(
                    participants=investor_user
                ).filter(
                    participants=business_owner_user
                ).exists():
                    conversation = Conversation.objects.create()
                    conversation.participants.add(investor_user, business_owner_user)
                    logger.info(f"Created new conversation for existing friendship")
        else:
            # Create a new friend request from investor to business owner
            friend_request = FriendRequest.objects.create(
                from_user=investor_user,
                to_user=business_owner_user,
                status='accepted'  # Automatically accept the request
            )
            logger.info(f"Created new friend request: {friend_request.id}")
            
            # Create a conversation between the two users
            conversation = Conversation.objects.create()
            conversation.participants.add(investor_user, business_owner_user)
            logger.info(f"Created new conversation: {conversation.id}")
            
        logger.info(f"Automatic friendship creation successful between {investor_user.username} and {business_owner_user.username}")
        return True
    except Exception as e:
        logger.error(f"Error creating automatic friendship between {investor_user.username} and {business_owner_user.username}: {e}")
        return False 
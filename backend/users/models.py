# MicroVest/users/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class CustomUser(AbstractUser):
    # ... (your existing field definitions) ...
    name = models.CharField(_("full name"), max_length=100)
    dob = models.DateField(_("date of birth")) # This field is causing the error
    address = models.TextField(_("address"), blank=True, null=True)
    designation = models.CharField(_("designation"), max_length=100, blank=True, null=True)
    phone_number = models.CharField(_("phone number"), max_length=20, unique=True)
    id_document_url = models.CharField(_("ID document URL"), max_length=255, blank=True, null=True)
    USER_TYPE_CHOICES = (
        ('investor', _('Investor')),
        ('entrepreneur', _('Entrepreneur')),
    )
    user_type = models.CharField(
        _("user type"),
        max_length=12,
        choices=USER_TYPE_CHOICES,
        default='investor',
        db_index=True
    )

    # --- ADD/MODIFY THIS SECTION ---
    # Specify additional fields that are required when creating a user via createsuperuser.
    # 'username' and 'password' are always required by default.
    # 'email' is typically added here if you want it prompted and required.
    REQUIRED_FIELDS = ['email', 'name', 'dob', 'phone_number', 'user_type'] # Add all your NOT NULL fields

    # You don't usually need to override __str__ or Meta unless you want custom behavior
    def __str__(self):
        return self.email or self.username or f"User {self.pk}"

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def get_friends(self):
        # Friends where I sent the request and it was accepted
        sent_requests = FriendRequest.objects.filter(
            from_user=self, status='accepted'
        ).values_list('to_user', flat=True)

        # Friends where I received the request and it was accepted
        received_requests = FriendRequest.objects.filter(
            to_user=self, status='accepted'
        ).values_list('from_user', flat=True)

        # Combine and get unique user IDs, then fetch the User objects
        friend_ids = list(set(list(sent_requests) + list(received_requests)))
        return CustomUser.objects.filter(id__in=friend_ids)

class FriendRequest(models.Model):
    STATUS_CHOICES = (
        ('pending','Pending'),
        ('accepted','Accepted'),
        ('rejected','Rejected'),
    )

    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name = 'friend_requests_sent',
        on_delete = models.CASCADE
    )
    
    to_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='friend_requests_received',
        on_delete=models.CASCADE
    )

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_user','to_user')
        ordering = ['-timestamp']
        verbose_name = "Friend Request"
        verbose_name_plural = 'Friend Requests'

    def __str__(self):
        return f"{self.from_user.username} to {self.to_user.username} - {self.status}"
    
class Message(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='sent_messages',
        on_delete=models.CASCADE
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='received_messages',
        on_delete=models.CASCADE
    )
    content = models.TextField(_("message content"))
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['timestamp'] # Order messages by time sent
        verbose_name = "Message"
        verbose_name_plural = "Messages"

    def __str__(self):
        return f"From {self.sender.username} to {self.receiver.username} ({self.timestamp.strftime('%Y-%m-%d %H:%M')})"
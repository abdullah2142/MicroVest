from django.shortcuts import render, redirect, get_object_or_404
from .forms import CustomUserCreationForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.db import transaction 
from django.db.models import Q # For complex queries
from .models import FriendRequest, Message
from .forms import CustomUserChangeForm

User = get_user_model()

def signup(request):
    # ... (Your existing signup view) ...
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, f'Account created for {user.username}! You can now log in.')
            return redirect('login')
    else:
        form = CustomUserCreationForm()
    return render(request, 'users/signup.html', {'form': form})

@login_required
def profile(request):
    return render(request, 'users/profile.html')

# --- Friend Request Views ---
@login_required
def friend_requests(request):
    # Requests sent by me that are pending
    sent_pending_requests = FriendRequest.objects.filter(
        from_user=request.user, status='pending'
    )
    # Requests received by me that are pending
    received_pending_requests = FriendRequest.objects.filter(
        to_user=request.user, status='pending'
    )

    # All users except the current user (for sending new requests)
    # Exclude users you've already sent a pending request to
    # Exclude users who have sent you a pending request
    # Exclude users who are already friends
    all_other_users = User.objects.exclude(id=request.user.id)

    # --- NEW: Prepare lists of IDs for template checks ---
    sent_to_user_ids = sent_pending_requests.values_list('to_user__id', flat=True)
    received_from_user_ids = received_pending_requests.values_list('from_user__id', flat=True)
    my_friends = request.user.get_friends()
    my_friend_ids = my_friends.values_list('id', flat=True)

    # Filter out users who already have a pending request or are already friends
    # This loop is more explicit for clarity. A more efficient way for large datasets
    # would be to use Q objects in the initial query or exclude based on the collected IDs.
    # For now, let's keep it simple to ensure the template logic is clear.
    users_to_display_for_sending = []
    for user_obj in all_other_users:
        if user_obj.id not in sent_to_user_ids and \
           user_obj.id not in received_from_user_ids and \
           user_obj.id not in my_friend_ids:
            users_to_display_for_sending.append(user_obj)


    context = {
        'sent_pending_requests': sent_pending_requests,
        'received_pending_requests': received_pending_requests,
        'my_friends': my_friends, # Keep this as User objects for display
        'users_to_display_for_sending': users_to_display_for_sending, # Users you can send a new request to
        # Also pass the IDs directly for template checks if needed, but the filtered list should suffice
        'sent_to_user_ids': sent_to_user_ids,
        'received_from_user_ids': received_from_user_ids,
        'my_friend_ids': my_friend_ids,
    }
    return render(request, 'users/friend_requests.html', context)

@login_required
def send_friend_request(request, to_user_id):
    to_user = get_object_or_404(User, id=to_user_id)

    # Prevent sending request to self
    if request.user == to_user:
        messages.error(request, "You cannot send a friend request to yourself.")
        return redirect('friend_requests')

    # Check if a request already exists in either direction or if they are already friends
    existing_request = FriendRequest.objects.filter(
        Q(from_user=request.user, to_user=to_user) |
        Q(from_user=to_user, to_user=request.user)
    ).first()

    if existing_request:
        if existing_request.status == 'accepted':
            messages.warning(request, f"You are already friends with {to_user.username}.")
        elif existing_request.status == 'pending':
            if existing_request.from_user == request.user:
                messages.warning(request, f"You have already sent a pending request to {to_user.username}.")
            else:
                messages.warning(request, f"{to_user.username} has already sent you a pending request. Please accept it.")
        return redirect('friend_requests')

    FriendRequest.objects.create(from_user=request.user, to_user=to_user, status='pending')
    messages.success(request, f"Friend request sent to {to_user.username}.")
    return redirect('friend_requests')


@login_required
def accept_friend_request(request, request_id):
    friend_request = get_object_or_404(FriendRequest, id=request_id)

    # Ensure the request is addressed to the current user and is pending
    if friend_request.to_user == request.user and friend_request.status == 'pending':
        friend_request.status = 'accepted'
        friend_request.save()
        messages.success(request, f"You are now friends with {friend_request.from_user.username}.")
    else:
        messages.error(request, "Invalid or already handled friend request.")
    return redirect('friend_requests')


@login_required
def reject_friend_request(request, request_id):
    friend_request = get_object_or_404(FriendRequest, id=request_id)

    # Ensure the request is addressed to the current user and is pending
    if friend_request.to_user == request.user and friend_request.status == 'pending':
        friend_request.status = 'rejected'
        friend_request.save()
        messages.info(request, f"You have rejected the friend request from {friend_request.from_user.username}.")
    else:
        messages.error(request, "Invalid or already handled friend request.")
    return redirect('friend_requests')


# --- Messaging Views ---
@login_required
def messages_list(request):
    """
    Displays a list of friends (conversations) the current user can message.
    """
    my_friends = request.user.get_friends()
    context = {
        'my_friends': my_friends,
    }
    return render(request, 'users/messages_list.html', context) # We'll create this template next


@login_required
def messaging_with_user(request, friend_id):
    """
    Displays messages between the current user and a specific friend.
    Allows sending new messages to that friend.
    """
    friend = get_object_or_404(User, id=friend_id)

    # --- Crucial: Check if they are friends ---
    # Get all friend IDs for the current user
    current_user_friend_ids = request.user.get_friends().values_list('id', flat=True)

    if friend.id not in current_user_friend_ids:
        messages.error(request, f"You are not friends with {friend.username}. You cannot message them.")
        return redirect('messages_list') # Redirect back to the friends list

    # Get messages exchanged between the current user and the friend
    # Use Q objects to get messages sent by current user to friend OR by friend to current user
    messages_exchange = Message.objects.filter(
        Q(sender=request.user, receiver=friend) |
        Q(sender=friend, receiver=request.user)
    ).order_by('timestamp') # Ensure chronological order

    # Mark received messages as read
    Message.objects.filter(sender=friend, receiver=request.user, is_read=False).update(is_read=True)


    context = {
        'friend': friend,
        'messages': messages_exchange,
    }
    return render(request, 'users/messaging.html', context)


@login_required
def send_message(request, receiver_id):
    """
    Handles sending a message from the current user to a specific receiver.
    This view will typically be called via a POST request from the messaging.html page.
    """
    receiver = get_object_or_404(User, id=receiver_id)

    # --- Crucial: Check if they are friends before allowing message ---
    current_user_friend_ids = request.user.get_friends().values_list('id', flat=True)

    if receiver.id not in current_user_friend_ids:
        messages.error(request, f"You are not friends with {receiver.username}. Message cannot be sent.")
        return redirect('messages_list')

    if request.method == 'POST':
        content = request.POST.get('message_content', '').strip()
        if content:
            with transaction.atomic(): # Ensure message is saved cleanly
                Message.objects.create(
                    sender=request.user,
                    receiver=receiver,
                    content=content
                )
                messages.success(request, "Message sent!")
        else:
            messages.error(request, "Message content cannot be empty.")
    else:
        messages.error(request, "Invalid request method.")

    # Redirect back to the conversation page with the specific user
    return redirect('messaging_with', friend_id=receiver_id)

@login_required
def edit_profile(request):
    user = request.user # Get the currently logged-in user

    if request.method == 'POST':
        # Populate the form with data from the request AND the existing user instance
        form = CustomUserChangeForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save() # This saves the changes to the database
            messages.success(request, 'Your profile was successfully updated!')
            # Redirect to the profile detail page (assuming you have one)
            return redirect('profile')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        # For a GET request, create the form instance populated with current user data
        form = CustomUserChangeForm(instance=user)

    context = {
        'form': form,
    }
    return render(request, 'users/edit_profile.html', context)

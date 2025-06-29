from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import FriendRequest, Conversation, Message
from .serializers import (
    FriendRequestSerializer, CreateFriendRequestSerializer,
    ConversationSerializer, MessageSerializer, CreateMessageSerializer,
    UserSerializer
)
from rest_framework import serializers

User = get_user_model()

# Create your views here.

# Friend Request Views
class FriendRequestListView(generics.ListAPIView):
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return FriendRequest.objects.filter(
            Q(from_user=self.request.user) | Q(to_user=self.request.user)
        )

class CreateFriendRequestView(generics.CreateAPIView):
    serializer_class = CreateFriendRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        # Check if a friend request already exists between these users
        existing_request = FriendRequest.objects.filter(
            from_user=self.request.user,
            to_user=serializer.validated_data['to_user']
        ).first()
        
        if existing_request:
            # If request exists and was rejected, update it to pending
            if existing_request.status == 'rejected':
                existing_request.status = 'pending'
                existing_request.save()
                return
            # If request is pending or accepted, don't create a new one
            elif existing_request.status in ['pending', 'accepted']:
                raise serializers.ValidationError("A friend request already exists with this user.")
        
        # Create new friend request
        serializer.save(from_user=self.request.user)

class AcceptRejectFriendRequestView(generics.UpdateAPIView):
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]
    queryset = FriendRequest.objects.all()
    
    def update(self, request, *args, **kwargs):
        friend_request = self.get_object()
        
        # Check if the current user is the recipient
        if friend_request.to_user != request.user:
            return Response(
                {"error": "You can only accept/reject friend requests sent to you."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        action = request.data.get('action')
        if action == 'accept':
            friend_request.status = 'accepted'
            friend_request.save()
            
            # Create a conversation between the two users
            conversation = Conversation.objects.create()
            conversation.participants.add(friend_request.from_user, friend_request.to_user)
            
            return Response({"message": "Friend request accepted!"}, status=status.HTTP_200_OK)
        elif action == 'reject':
            friend_request.status = 'rejected'
            friend_request.save()
            return Response({"message": "Friend request rejected."}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Invalid action. Use 'accept' or 'reject'."},
                status=status.HTTP_400_BAD_REQUEST
            )

# User Search View
class UserSearchView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        if query:
            return User.objects.filter(
                Q(username__icontains=query) |
                Q(first_name__icontains=query) |
                Q(last_name__icontains=query)
            ).exclude(id=self.request.user.id)
        else:
            # Return all users except the current user when no query is provided
            return User.objects.exclude(id=self.request.user.id)

# Friends List View
class FriendsListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Get all accepted friend requests where current user is either sender or receiver
        accepted_requests = FriendRequest.objects.filter(
            Q(from_user=self.request.user) | Q(to_user=self.request.user),
            status='accepted'
        )
        
        # Get the other user from each accepted request
        friend_ids = []
        for request in accepted_requests:
            if request.from_user == self.request.user:
                friend_ids.append(request.to_user.id)
            else:
                friend_ids.append(request.from_user.id)
        
        return User.objects.filter(id__in=friend_ids)

class UnfriendView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = FriendRequest.objects.all()
    
    def destroy(self, request, *args, **kwargs):
        target_user_id = request.data.get('target_user_id')
        if not target_user_id:
            return Response(
                {"error": "target_user_id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        friend_request = FriendRequest.objects.filter(
            Q(from_user=request.user, to_user_id=target_user_id) | 
            Q(from_user_id=target_user_id, to_user=request.user),
            status='accepted'
        ).first()
        if not friend_request:
            # Return 200 with a message even if already unfriended
            return Response({"message": "No friendship found or already removed."}, status=status.HTTP_200_OK)
        friend_request.delete()
        from .models import Conversation
        conversation = Conversation.objects.filter(
            participants=request.user
        ).filter(
            participants_id=target_user_id
        ).first()
        if conversation:
            conversation.delete()
        return Response({"message": "Friend removed successfully"}, status=status.HTTP_200_OK)

# Conversation Views
class ConversationListView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user)
    
    def get_serializer_context(self):
        return {'request': self.request}

class ConversationDetailView(generics.RetrieveAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    queryset = Conversation.objects.all()
    
    def get_serializer_context(self):
        return {'request': self.request}

# Message Views
class MessageListView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        conversation_id = self.kwargs.get('conversation_id')
        return Message.objects.filter(conversation_id=conversation_id)
    
    def perform_create(self, serializer):
        conversation_id = self.kwargs.get('conversation_id')
        conversation = Conversation.objects.get(id=conversation_id)
        
        # Check if user is part of the conversation
        if self.request.user not in conversation.participants.all():
            raise PermissionError("You are not part of this conversation.")
        
        serializer.save(sender=self.request.user, conversation=conversation)
        
        # Mark other messages as read
        Message.objects.filter(
            conversation=conversation,
            sender__in=conversation.participants.exclude(id=self.request.user.id)
        ).update(is_read=True)

class MarkMessagesAsReadView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        conversation_id = self.kwargs.get('conversation_id')
        conversation = Conversation.objects.get(id=conversation_id)
        
        # Check if user is part of the conversation
        if request.user not in conversation.participants.all():
            return Response(
                {"error": "You are not part of this conversation."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Mark messages from other participants as read
        Message.objects.filter(
            conversation=conversation,
            sender__in=conversation.participants.exclude(id=request.user.id)
        ).update(is_read=True)
        
        return Response({"message": "Messages marked as read."}, status=status.HTTP_200_OK)

class ConversationDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Conversation.objects.all()

    def delete(self, request, *args, **kwargs):
        conversation_id = kwargs.get('pk')
        conversation = Conversation.objects.filter(id=conversation_id, participants=request.user).first()
        if not conversation:
            return Response({"error": "Conversation not found or you are not a participant."}, status=status.HTTP_404_NOT_FOUND)
        conversation.delete()
        return Response({"message": "Conversation deleted successfully."}, status=status.HTTP_200_OK)

class CreateOrGetConversationView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        target_user_id = request.data.get('target_user_id')
        if not target_user_id:
            return Response(
                {"error": "target_user_id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            target_user = User.objects.get(id=target_user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Target user not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if conversation already exists between these users
        existing_conversation = Conversation.objects.filter(
            participants=request.user
        ).filter(
            participants=target_user
        ).first()
        
        if existing_conversation:
            # Return existing conversation
            serializer = ConversationSerializer(existing_conversation, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Create new conversation
            conversation = Conversation.objects.create()
            conversation.participants.add(request.user, target_user)
            serializer = ConversationSerializer(conversation, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)

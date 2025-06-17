# MicroVest/users/forms.py

from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        # Define all fields from CustomUser that you want on the signup form.
        # UserCreationForm.Meta.fields already includes 'username', 'password', 'password2'
        fields = UserCreationForm.Meta.fields + (
            'name',
            'dob',
            'address',
            'designation',
            'phone_number',
            'id_document_url',
            'user_type',
            'email', # It's good practice to explicitly include email if you want it on signup form
        )

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        # Explicitly list the fields you want to be editable in the profile
        fields = (
            'name',
            'dob',
            'address',
            'designation',
            'phone_number',
            'id_document_url',
            'user_type',
            # 'email', 
            # Include email here if you want users to be able to change it
            # You might also include 'username' if you want it editable,
            # but often username changes are handled separately or restricted.
            # Do NOT include 'password' here; password changes are handled by a separate form.
        )
        
        # Add widgets for better styling and specific input types (like date picker)
        widgets = {
            'dob': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'address': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'designation': forms.TextInput(attrs={'class': 'form-control'}),
            'phone_number': forms.TextInput(attrs={'class': 'form-control'}),
            'id_document_url': forms.TextInput(attrs={'class': 'form-control'}), # Consider FileInput if it's an upload
            'user_type': forms.Select(attrs={'class': 'form-select'}),
        }
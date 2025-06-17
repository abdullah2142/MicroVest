# MicroVest/backend/businesses/views.py
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Business # <--- ADD THIS LINE to import your Business model

@login_required
def browse_businesses(request):
    """
    View to display all businesses available on the platform.
    """
    # Fetch all Business objects from the database
    all_businesses = Business.objects.all()

    context = {
        'page_title': 'Browse Businesses',
        'businesses': all_businesses, # <--- CHANGE THIS LINE to pass the fetched businesses
    }
    return render(request, 'businesses/browse_businesses.html', context)
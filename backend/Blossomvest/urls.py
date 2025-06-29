"""
URL configuration for Blossomvest project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# Blossomvest/urls.py (UPDATED)

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/investors/', include('investors.urls')), # ADD THIS LINE
    path('api/', include('investments.urls')), # This might conflict if 'investments' is also for investor-related
                                             # you might want to review 'investments.urls' content
                                             # and ensure no overlap with 'api/investors/'
    path('api/messaging/', include('messaging.urls')),
    path('api/logs/', include('logs.urls')),
    path('api/investments-tracking/', include('investments_tracking.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/users/', include('users.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
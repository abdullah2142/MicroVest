from django.contrib import admin
from .models import Business, BusinessImage, BusinessVideo, BusinessDocument, CalendarEvent

@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'entrepreneur_name', 'category', 'location', 
        'funding_goal', 'current_funding', 'backers', 'user', 'created_at'
    ]
    list_filter = [
        'category', 'location', 'created_at', 'updated_at'
    ]
    search_fields = [
        'title', 'entrepreneur_name', 'description', 'user__username', 'user__email'
    ]
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'entrepreneur_name', 'tagline', 'description', 'category', 'location')
        }),
        ('Funding Information', {
            'fields': ('funding_goal', 'current_funding', 'backers', 'min_investment')
        }),
        ('Business Details', {
            'fields': ('team_size', 'website', 'social_media', 'business_plan', 'financial_projections')
        }),
        ('Market Information', {
            'fields': ('market_analysis', 'competitive_advantage', 'use_of_funds')
        }),
        ('Quick Facts', {
            'fields': ('founding_year', 'industry_experience', 'key_achievements', 'target_market_size', 'revenue_model', 'growth_metrics')
        }),
        ('User Information', {
            'fields': ('user',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    ordering = ['-created_at']

@admin.register(BusinessImage)
class BusinessImageAdmin(admin.ModelAdmin):
    list_display = ['business', 'image', 'order', 'id']
    list_filter = ['business__category']
    search_fields = ['business__title']
    ordering = ['business', 'order']

@admin.register(BusinessVideo)
class BusinessVideoAdmin(admin.ModelAdmin):
    list_display = ['business', 'title', 'duration', 'id']
    list_filter = ['business__category']
    search_fields = ['business__title', 'title']
    ordering = ['business', 'title']

@admin.register(BusinessDocument)
class BusinessDocumentAdmin(admin.ModelAdmin):
    list_display = ['business', 'name', 'size', 'id']
    list_filter = ['business__category']
    search_fields = ['business__title', 'name']
    ordering = ['business', 'name']

@admin.register(CalendarEvent)
class CalendarEventAdmin(admin.ModelAdmin):
    list_display = ['title', 'business', 'event_type', 'date', 'time', 'is_completed']
    list_filter = ['event_type', 'date', 'is_completed', 'business']
    search_fields = ['title', 'description', 'business__title']
    date_hierarchy = 'date'
    list_editable = ['is_completed']
    
    fieldsets = (
        ('Event Details', {
            'fields': ('title', 'description', 'event_type')
        }),
        ('Schedule', {
            'fields': ('date', 'time', 'duration_minutes')
        }),
        ('Location & Status', {
            'fields': ('location', 'is_completed')
        }),
        ('Business', {
            'fields': ('business',)
        }),
    )

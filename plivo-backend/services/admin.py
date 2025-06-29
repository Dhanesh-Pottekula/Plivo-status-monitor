from django.contrib import admin
from .models import Service

# Register your models here.

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'organization', 'current_status', 'publicly_visible', 'created_at')
    list_filter = ('current_status', 'publicly_visible', 'organization', 'created_at')
    search_fields = ('name', 'description', 'organization__name')
    readonly_fields = ('id', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'name', 'description')
        }),
        ('Organization & Status', {
            'fields': ('organization', 'current_status', 'publicly_visible')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Filter services by user's organization if not superuser"""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(organization=request.user.organization)

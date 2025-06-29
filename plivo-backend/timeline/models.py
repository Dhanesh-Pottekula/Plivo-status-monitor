from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from users.models import User, Organization

class Timeline(models.Model):
    """Timeline model to track incidents and service status changes"""
    
    EVENT_TYPES = [
        ('incident_created', 'Incident Created'),
        ('incident_updated', 'Incident Updated'),
        ('incident_deleted', 'Incident Deleted'),
        ('service_status_changed', 'Service Status Changed'),
    ]
    
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='timeline_events',
        verbose_name='Organization'
    )
    
    event_type = models.CharField(
        max_length=30,
        choices=EVENT_TYPES,
        verbose_name='Event Type'
    )
    
    # Generic foreign key to link to either Service or Incident
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # User who performed the action
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='timeline_actions',
        verbose_name='User'
    )
    
    # Additional metadata for the event
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    
    # For status changes, store old and new values
    old_value = models.CharField(max_length=100, blank=True, null=True)
    new_value = models.CharField(max_length=100, blank=True, null=True)
    
    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'timeline'
        indexes = [
            models.Index(fields=['organization']),
            models.Index(fields=['event_type']),
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['user']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.event_type} - {self.title} ({self.created_at})"
    
    def to_dict(self):
        """Convert model instance to dictionary format"""
        return {
            "id": self.id,
            "organizationId": self.organization_id,
            "eventType": self.event_type,
            "contentType": self.content_type.model,
            "objectId": self.object_id,
            "userId": self.user_id,
            "userName": self.user.full_name or self.user.username,
            "title": self.title,
            "description": self.description,
            "oldValue": self.old_value,
            "newValue": self.new_value,
            "createdAt": self.created_at.isoformat() + "Z"
        }

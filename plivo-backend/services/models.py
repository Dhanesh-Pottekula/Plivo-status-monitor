from django.db import models
import uuid
from users.models import Organization

# Create your models here.

class Service(models.Model):
    STATUS_CHOICES = [
        ('operational', 'Operational'),
        ('degraded_performance', 'Degraded Performance'),
        ('partial_outage', 'Partial Outage'),
        ('major_outage', 'Major Outage'),
    ]
    
    
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='services',
        verbose_name='Organization'
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    current_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='operational'
    )
    publicly_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'services'
        indexes = [
            models.Index(fields=['organization']),
            models.Index(fields=['current_status']),
            models.Index(fields=['publicly_visible']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.organization.name})"
    
    def to_dict(self):
        """Convert model instance to dictionary format matching the API spec"""
        return {
            "id": self.id,
            "organizationId": self.organization_id,
            "name": self.name,
            "description": self.description or "",
            "currentStatus": self.current_status,
            "publiclyVisible": self.publicly_visible,
            "createdAt": self.created_at.isoformat() + "Z",
            "updatedAt": self.updated_at.isoformat() + "Z"
        }

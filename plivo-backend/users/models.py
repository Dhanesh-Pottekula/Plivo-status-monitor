from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
import uuid
from datetime import timedelta
from django.utils import timezone


class Organization(models.Model):
    name = models.CharField(max_length=200)
    domain = models.CharField(max_length=200, unique=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
    USER_ROLES = [
        ('admin', 'Admin'),
        ('team', 'Team Member'),
        ('user', 'User'),
    ]
    
    username = models.EmailField(unique=True,null=False,blank=False)
    full_name = models.CharField(max_length=200, blank=True, null=True)
    
    # Multi-tenant fields
    organization = models.ForeignKey(
        Organization, 
        on_delete=models.CASCADE, 
        related_name='users',
        null=True,
        blank=True
    )
    role = models.CharField(max_length=10, choices=USER_ROLES, default='user')
    
    # Additional fields
    has_access = models.BooleanField(default=False)
    is_organization_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'full_name']

    def __str__(self):
        return f"{self.get_full_name()} ({self.username})"

    def get_full_name(self):
        return self.full_name

    @property
    def is_admin(self):
        return self.role == 'admin' or self.is_organization_admin

    @property
    def is_team_member(self):
        return self.role == 'team'


class InviteLink(models.Model):
    """Model for team member invitation links"""
    token = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.EmailField(blank=True, null=True)
    role = models.CharField(max_length=10, choices=User.USER_ROLES, default='team')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='invite_links')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_invites')
    used_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='used_invites')
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'invite_links'
        indexes = [
            models.Index(fields=['token']),
            models.Index(fields=['created_by']),
            models.Index(fields=['used_by']),
            models.Index(fields=['expires_at']),
        ]

    def __str__(self):
        return f"Invite for {self.username or 'anyone'} to {self.organization.name}"

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    @property
    def is_valid(self):
        return not self.used_by and not self.is_expired

    def mark_as_used(self, user):
        """Mark the invite as used by a specific user"""
        self.used_by = user
        self.save()
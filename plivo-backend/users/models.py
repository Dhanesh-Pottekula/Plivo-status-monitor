from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator


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
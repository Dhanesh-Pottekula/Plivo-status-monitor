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
    
    # Remove username field and use email as primary identifier
    username = None
    email = models.EmailField(unique=True)
    
    # User profile fields
    phone = models.CharField(
        max_length=15, 
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ],
        blank=True,
        null=True
    )
    address = models.CharField(max_length=500, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=10, blank=True, null=True)
    
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

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def is_admin(self):
        return self.role == 'admin' or self.is_organization_admin

    @property
    def is_team_member(self):
        return self.role == 'team'
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()


class EmailBackend(ModelBackend):
    """
    Custom authentication backend that allows users to authenticate using their email address.
    """
    
    def authenticate(self, request, email=None, password=None, **kwargs):
        if email is None or password is None:
            return None
        
        try:
            # Try to fetch the user by email
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return None
        
        # Check if the user can authenticate
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
    
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None 
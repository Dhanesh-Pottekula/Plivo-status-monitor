from rest_framework.authentication import BaseAuthentication
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
import logging

logger = logging.getLogger(__name__)
User = get_user_model()


class CookieJWTAuthentication(BaseAuthentication):
    """
    Custom authentication class that authenticates users using JWT tokens from cookies.
    This replaces the middleware approach with a proper DRF authentication class.
    """
    
    def authenticate(self, request):
        # Get token from cookie
        token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
        
        if not token:
            return None
            
        try:
            # Decode and validate the token
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            
            # Get user from database
            user = User.objects.get(id=user_id)
            
            if not user.is_active:
                raise AuthenticationFailed('User account is disabled.')
                
            return (user, access_token)
            
        except (InvalidToken, TokenError) as e:
            logger.warning(f"Invalid JWT token: {e}")
            # Don't raise AuthenticationFailed for invalid tokens, just return None
            # This allows the request to proceed without authentication
            return None
        except User.DoesNotExist:
            logger.warning(f"User not found for token")
            # Don't raise AuthenticationFailed for missing users, just return None
            return None
        except Exception as e:
            logger.error(f"JWT authentication error: {e}")
            # Don't raise AuthenticationFailed for other errors, just return None
            return None
    
    def authenticate_header(self, request):
        return 'Cookie' 
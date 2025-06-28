from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.conf import settings
from django.http import JsonResponse
from . import urls
import logging

logger = logging.getLogger(__name__)
User = get_user_model()


class JWTAuthenticationMiddleware(MiddlewareMixin):
    """
    Middleware to authenticate users using JWT tokens from cookies.
    This middleware runs before the view and sets the user on the request.
    """
    
    def process_request(self, request):
        # Skip authentication for certain paths
        print(request.path)
        if self._should_skip_auth(request.path):
            return None
            
        # Get token from cookie
        token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
        
        if not token:
            return JsonResponse(
                {'error': 'Authentication required. No token provided.'}, 
                status=401
            )
            
        try:
            # Decode and validate the token
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            
            # Get user from database
            user = User.objects.get(id=user_id)
            
            # Set user on request
            request.user = user
            
        except (InvalidToken, TokenError) as e:
            logger.warning(f"Invalid JWT token: {e}")
            return JsonResponse(
                {'error': 'Invalid or expired token.'}, 
                status=401
            )
        except User.DoesNotExist:
            logger.warning(f"User not found for token")
            return JsonResponse(
                {'error': 'User not found.'}, 
                status=401
            )
        except Exception as e:
            logger.error(f"JWT authentication error: {e}")
            return JsonResponse(
                {'error': 'Authentication error.'}, 
                status=401
            )
            
        return None
    
    def process_view(self, request, view_func, view_args, view_kwargs):
        """
        Check if the view is marked as public using the @public_endpoint decorator
        """
        if hasattr(view_func, 'is_public') and view_func.is_public:
            return None
        return None
    
    def _should_skip_auth(self, path):
        """Check if authentication should be skipped for this path."""
        
        # Remove query parameters if present
        if '?' in path:
            path = path.split('?')[0]
        
        # Remove trailing slash if present
        if path.endswith('/'):
            path = path[:-1]
        
        # Add admin path to skip list (without trailing slashes for comparison)
        skip_paths = ['/admin', '/api/auth/signup', '/api/auth/login', '/api/health']
        
        return any(path.startswith(skip_path) for skip_path in skip_paths) 
from django.urls import path

from . import views



urlpatterns = [
    # Authentication endpoints
    path('auth/signup/', views.signup_view, name='signup'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/profile/', views.user_profile_view, name='user_profile'),
    path('auth/profile/update/', views.update_profile_view, name='update_profile'),
    
    # Organization endpoints
    path('organizations/', views.get_organizations_view, name='get_organizations'),
    path('organizations/create/', views.create_organization_view, name='create_organization'),
    
    # Health check
    path('health/', views.health_check_view, name='health_check'),
]
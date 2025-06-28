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
    
    # Invite link endpoints
    path('invite/create/', views.invite_url_team_member_view, name='create_invite'),
    path('invite/verify/<str:token>/', views.verify_invite_token_view, name='verify_invite'),
    path('invite/list/', views.get_team_members_view, name='get_team_members'),
    

]
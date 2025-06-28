from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import json
import re
from .models import User, Organization, InviteLink
from .validators import (
     validate_signup_data, 
    validate_login_data, validate_profile_fields,
)


def public_endpoint(view_func):
    """Decorator to mark views as public endpoints that don't require authentication"""
    view_func.is_public = True
    return view_func


def get_user_data(user):
    """Convert user object to dictionary"""
    return {
        'id': str(user.id),
        'username': user.username,
        'full_name': user.full_name,
        'organization': {
            'id': str(user.organization.id),
            'name': user.organization.name,
            'domain': user.organization.domain,
            'created_at': user.organization.created_at.isoformat(),
            'updated_at': user.organization.updated_at.isoformat(),
            'is_active': user.organization.is_active
        } if user.organization else None,
        'role': user.role,
        'is_organization_admin': user.is_organization_admin,
        'is_active': user.is_active,
        'created_at': user.created_at.isoformat(),
        'updated_at': user.updated_at.isoformat()
    }


@api_view(['POST'])
@permission_classes([AllowAny])
@public_endpoint
def signup_view(request):
    """
    User registration endpoint that creates a new user and organization, returns JWT token in cookie
    """
    try:
        data = request.data
        
        # Validate all signup data
        validation_errors = validate_signup_data(data)
        if validation_errors:
            return Response({'error': validation_errors}, status=status.HTTP_400_BAD_REQUEST)
        
        invite_link = None
        # Only validate invite code for team members
        if data.get('role') == 'team':
            if not data.get('token'):
                return Response({'error': 'invite code is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                invite_link = InviteLink.objects.get(token=data.get('token'))
                if invite_link.username != data.get('username'):
                    return Response({'error': "invite code is not valid"}, status=status.HTTP_400_BAD_REQUEST)
                
                # Check if invite is still valid and not used
                if not invite_link.is_valid or invite_link.used_by:
                    return Response({'error': "invite code has expired or already used"}, status=status.HTTP_400_BAD_REQUEST)
                    
            except InviteLink.DoesNotExist:
                return Response({'error': "invalid invite code"}, status=status.HTTP_400_BAD_REQUEST)

        # Create or get organization
        organization = None
        if data.get('organization_name') and data.get('role') == 'admin':
            # Check if organization with this name already exists
            organization, created = Organization.objects.get_or_create(
                name=data['organization_name']
            )
        elif data.get('role') == 'team' and invite_link:
            # For team members, use the organization from the invite link
            organization = invite_link.organization
        
        # Create user
        user = User.objects.create_user(
            username=data['username'],
            password=data['password'],
            full_name=data['full_name'],
            role=data.get('role', 'user'),
            organization=organization,
            is_organization_admin=True if data.get('role') == 'admin' else False
        )
        
        # Mark invite link as used for team members
        if data.get('role') == 'team' and invite_link:
            invite_link.used_by = user
            invite_link.save()

        # Generate JWT token
        access_token = AccessToken.for_user(user)
        
        # Create response
        response_data = {
            'message': 'User registered successfully',
            'success': True
        }
        response = Response(response_data, status=status.HTTP_201_CREATED)
        
        # Set cookie
        response.set_cookie(
            settings.SIMPLE_JWT['AUTH_COOKIE'],
            str(access_token),
            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE']
        )
        
        return response
        
    except Exception as e:
        return Response(
            {'error': f'Registration failed: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
@public_endpoint
def login_view(request):
    """
    User login endpoint that authenticates user and returns JWT token in cookie
    """
    try:
        data = request.data
        
        # Validate login data
        validation_errors = validate_login_data(data)
        if validation_errors:
            return Response({'error': validation_errors}, status=status.HTTP_400_BAD_REQUEST)
        # Authenticate user
        user = authenticate(request, username=data['username'], password=data['password'])
        print(user)
        
        if user is not None:
            if not user.is_active:
                return Response({'error': 'User account is disabled'}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Generate JWT token
            access_token = AccessToken.for_user(user)
            
            response = Response({
                'message': 'Login successful',
                'success': True
            }, status=status.HTTP_200_OK)
            
            # Set cookie
            response.set_cookie(
                settings.SIMPLE_JWT['AUTH_COOKIE'],
                str(access_token),
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE']
            )
            
            return response
        else:
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
    
    except Exception as e:
        return Response(
            {'error': f'Login failed: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    User logout endpoint that clears JWT token from cookie
    """
    response = Response({'message': 'Logout successful', 'success': True}, status=status.HTTP_200_OK)
    
    # Clear cookie
    response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
    
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """
    Get current user profile
    """
    return Response({
        'user': get_user_data(request.user),
        'success': True
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_organizations_view(request):
    """
    Get all organizations (for admin users) or user's organization
    """
    try:
        if request.user.role == 'admin':
            # Admin can see all organizations
            organizations = Organization.objects.filter(is_active=True)
            organizations_data = [{
                'id': str(org.id),
                'name': org.name,
                'domain': org.domain,
                'created_at': org.created_at.isoformat(),
                'updated_at': org.updated_at.isoformat(),
                'is_active': org.is_active
            } for org in organizations]
        else:
            # Regular users can only see their organization
            if request.user.organization:
                organizations_data = [{
                    'id': str(request.user.organization.id),
                    'name': request.user.organization.name,
                    'domain': request.user.organization.domain,
                    'created_at': request.user.organization.created_at.isoformat(),
                    'updated_at': request.user.organization.updated_at.isoformat(),
                    'is_active': request.user.organization.is_active
                }]
            else:
                organizations_data = []
        
        return Response({
            'organizations': organizations_data,
            'success': True
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch organizations: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    """
    Update current user profile
    """
    try:
        data = request.data
        user = request.user
        
        # Validate profile fields
        validation_errors = validate_profile_fields(data)
        if validation_errors:
            return Response({'error': validation_errors}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update allowed fields
        if 'first_name' in data:
            user.first_name = data['first_name']
        
        if 'last_name' in data:
            user.last_name = data['last_name']
        
        user.save()
        
        return Response({
            'message': 'Profile updated successfully',
            'success': True,
            'user': get_user_data(user)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Profile update failed: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def invite_url_team_member_view(request):
    """Create a unique URL for team member to join the organization valid for 1 day"""
    try:
        data = request.data
        if(not data.get('username')):
            return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)

        user_exists = User.objects.filter(username=data.get('username')).exists()
        if(user_exists):
            return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
        # Create invite link
        invite_link = InviteLink.objects.create(
            username=data.get('username'),  # Optional
            role=data.get('role', 'team'),
            organization=request.user.organization,
            created_by=request.user,
            expires_at=timezone.now() + timedelta(days=1)  # Valid for 1 day
        )
        
        # Generate the invite URL
        base_url = settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'
        invite_url = f"{base_url}/signup?token={invite_link.token}"
        
        return Response({
            'message': 'Invite link created successfully',
            'success': True,
            'invite_url': invite_url,
            'expires_at': invite_link.expires_at.isoformat(),
            'invite_data': {
                'id': str(invite_link.token),
                'username': invite_link.username,
                'role': invite_link.role,
                'created_at': invite_link.created_at.isoformat(),
                'expires_at': invite_link.expires_at.isoformat()
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to create invite link: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([AllowAny])
@public_endpoint
def verify_invite_token_view(request, token):
    """Verify if an invite token is valid and return invite details"""
    print(token)
    try:
        if not token:
            return Response(
                {'error': 'Token is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get invite link
        try:
            invite_link = InviteLink.objects.get(token=token)
        except InviteLink.DoesNotExist:
            return Response(
                {'error': 'Invalid invite token'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if invite is valid
        if not invite_link.is_valid or  invite_link.used_by:
            return Response(
                {'error': 'Invalid invite token'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response({
            'success': True,
            'invite_data': {
                'username': invite_link.username,
                'role': invite_link.role,
                'organization': {
                    'id': str(invite_link.organization.id),
                    'name': invite_link.organization.name,
                    'domain': invite_link.organization.domain
                },
                'expires_at': invite_link.expires_at.isoformat()
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to verify invite token: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_team_members_view(request):
    """Get all team members of the current user"""
    try:
        # Only organization admins can view invite links
        if not request.user.is_organization_admin and request.user.role != 'admin':
            return Response(
                {'error': 'You do not have permission to view invite links'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        invite_links = InviteLink.objects.filter(
            created_by=request.user,
            organization=request.user.organization,
            used_by__isnull=False
        ).order_by('-created_at')
        
        invite_links_data = [{
            'id': str(invite.token),
            'username': invite.username,
            'role': invite.role,
            'is_expired': invite.is_expired,
            'is_valid': invite.is_valid,
            "token": invite.token,
            'used_by': {
                'id': str(invite.used_by.id),
                'username': invite.used_by.username,
                'full_name': invite.used_by.full_name,
                'has_access': invite.used_by.has_access
            } if invite.used_by else None,
            'created_at': invite.created_at.isoformat(),
            'expires_at': invite.expires_at.isoformat()
        } for invite in invite_links]
        
        return Response({
            'invite_links': invite_links_data,
            'success': True
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch invite links: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

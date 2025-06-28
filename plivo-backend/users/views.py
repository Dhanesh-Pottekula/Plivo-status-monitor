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
import json
import re
from .models import User, Organization
from .validators import (
    validate_email, validate_phone, validate_signup_data, 
    validate_login_data, validate_organization_data, validate_profile_fields
)


def public_endpoint(view_func):
    """
    Decorator to mark a view as a public endpoint that doesn't require authentication.
    This can be used as an alternative to adding URLs to PUBLIC_URLS list.
    """
    view_func.is_public = True
    return view_func


def get_user_data(user):
    """Convert user object to dictionary"""
    return {
        'id': str(user.id),
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone': user.phone,
        'address': user.address,
        'city': user.city,
        'state': user.state,
        'zip_code': user.zip_code,
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
        
        # Create or get organization
        organization = None
        if data.get('organization_name'):
            # Check if organization with this name already exists
            organization, created = Organization.objects.get_or_create(
                name=data['organization_name'],
                defaults={
                    'domain': data.get('organization_link', ''),
                    'is_active': True
                }
            )
            
            # If organization already exists, update domain if provided
            if not created and data.get('organization_link'):
                organization.domain = data['organization_link']
                organization.save()
        
        # Create user
        user = User.objects.create_user(
            email=data['email'],
            password=data['password'],
            full_name=data['full_name'],
            role=data.get('role', 'user'),
            organization=organization,
            is_organization_admin=True if data.get('role') == 'admin' else False
        )
        
        # Generate JWT token
        access_token = AccessToken.for_user(user)
        
        # Create response
        response_data = {
            'message': 'User registered successfully',
            'success': True,
            'user': get_user_data(user),
            'organization': {
                'id': str(organization.id),
                'name': organization.name,
                'domain': organization.domain,
                'created_at': organization.created_at.isoformat(),
                'updated_at': organization.updated_at.isoformat(),
                'is_active': organization.is_active
            } if organization else None
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
        user = authenticate(request, email=data['email'], password=data['password'])
        
        if user is not None:
            if not user.is_active:
                return Response({'error': 'User account is disabled'}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Generate JWT token
            access_token = AccessToken.for_user(user)
            
            # Create response
            response_data = {
                'message': 'Login successful',
                'success': True,
                'user': get_user_data(user)
            }
            response = Response(response_data, status=status.HTTP_200_OK)
            
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
@permission_classes([AllowAny])
@public_endpoint
def health_check_view(request):
    """
    Health check endpoint
    """
    return Response({'status': 'healthy'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_organization_view(request):
    """
    Create a new organization
    """
    try:
        data = request.data
        
        # Validate organization data
        validation_errors = validate_organization_data(data)
        if validation_errors:
            return Response({'error': validation_errors}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create organization
        organization = Organization.objects.create(
            name=data['name'],
            domain=data.get('domain', ''),
            is_active=True
        )
        
        # Update user's organization if they don't have one
        if not request.user.organization:
            request.user.organization = organization
            request.user.save()
        
        return Response({
            'message': 'Organization created successfully',
            'success': True,
            'organization': {
                'id': str(organization.id),
                'name': organization.name,
                'domain': organization.domain,
                'created_at': organization.created_at.isoformat(),
                'updated_at': organization.updated_at.isoformat(),
                'is_active': organization.is_active
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': f'Organization creation failed: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


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
        
        if 'phone' in data:
            user.phone = data['phone']
        
        if 'address' in data:
            user.address = data['address']
        
        if 'city' in data:
            user.city = data['city']
        
        if 'state' in data:
            user.state = data['state']
        
        if 'zip_code' in data:
            user.zip_code = data['zip_code']
        
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
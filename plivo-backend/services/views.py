from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import transaction
import json
from .models import Service
from users.models import Organization
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from users.permissions import IsOrganizationAdmin
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    ServiceSerializer, 
    ServiceListSerializer, 
    ServiceCreateSerializer, 
    ServiceUpdateSerializer
)

# Create your views here.

@api_view(['POST'])
@permission_classes([IsOrganizationAdmin])
def create_service(request):
    """Create a new service"""
    try:
        user = request.user
        organization = user.organization
        request.data['organizationId'] = organization.id
        print(request.data)
        serializer = ServiceCreateSerializer(
            data=request.data, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            service = serializer.save()
            response_serializer = ServiceSerializer(service)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_service(request, service_id):
    """Get a specific service by ID"""
    try:
        service = Service.objects.get(id=service_id)
        
        # Check if user has access to this service
        if request.user.is_authenticated:
            if request.user.organization != service.organization and not request.user.is_admin:
                return Response({
                    'error': 'Access denied. You can only view services from your organization.'
                }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ServiceSerializer(service)
        return Response(serializer.data)
        
    except ObjectDoesNotExist:
        return Response({
            'error': 'Service not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_services(request):
    """List all services for the user's organization"""
    try:
        # Get organization filter from query params
        org_id_str = request.user.organization.id
        user = request.user
        if not org_id_str:
            return Response({
                'error': 'Organization ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                organization = Organization.objects.get(id=org_id_str)
            except (ValueError, ObjectDoesNotExist):
                return Response({
                    'error': 'Organization not found'
                }, status=status.HTTP_404_NOT_FOUND)    
        
        # Get services for the organization
        if (user.role == 'admin' or (user.role == 'team' and organization.id)):
            services = Service.objects.filter(organization=organization)
        else:
            services = Service.objects.filter(organization=organization, publicly_visible=True)
        serializer = ServiceListSerializer(services, many=True)
        return Response(serializer.data)
        
    except Exception as e:
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@permission_classes([IsOrganizationAdmin])
def update_service(request, service_id):
    """Update a service"""
    try:
        service = Service.objects.get(id=service_id)
        if (service.organization.id != request.user.organization.id):
            return Response({
                'error': 'Access denied. You can only update services from your organization.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ServiceUpdateSerializer(
            service, 
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            updated_service = serializer.save()
            response_serializer = ServiceSerializer(updated_service)
            return Response(response_serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsOrganizationAdmin])
def delete_service(request, service_id):
    """Delete a service"""
    try:
        service = Service.objects.get(id=service_id)
        
        # Check if user has access to this service
        if request.user.organization != service.organization and not request.user.is_admin:
            return Response({
                'error': 'Access denied. You can only delete services from your organization.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        service.delete()
        
        return Response({
            'message': 'Service deleted successfully'
        }, status=status.HTTP_200_OK)
        
    except ObjectDoesNotExist:
        return Response({
            'error': 'Service not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

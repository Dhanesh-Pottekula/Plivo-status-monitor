from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import transaction
import json
from .models import Service, Incident
from users.models import Organization
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from users.permissions import IsOrganizationAdmin, IsOrganizationAdminOrTeamWithAccess
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    ServiceSerializer, 
    ServiceListSerializer, 
    ServiceCreateSerializer, 
    ServiceUpdateSerializer,
    IncidentSerializer,
    IncidentListSerializer,
    IncidentCreateSerializer,
    IncidentUpdateSerializer
)
from timeline.views import log_timeline_event
from users.views import public_endpoint

# Create your views here.

@api_view(['POST'])
@permission_classes([IsOrganizationAdminOrTeamWithAccess])
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
@public_endpoint
def get_service(request, service_id):
    """Get a specific service by ID"""
    try:
        print(service_id)
        service = Service.objects.get(id=service_id)
        print(service)
        serializer = ServiceSerializer(service)
        return Response(serializer.data)
        
    except Service.DoesNotExist:
        return Response({
            'error': 'Service not found'
        }, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
@public_endpoint
def list_services(request, org_id):
    """List all services for the user's organization"""
    try:
        # Get organization filter from query params
        org_id_str = org_id
        
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
        
        # Check if user is authenticated
        if request.user.is_authenticated:
            # Authenticated users can see all services for their organization
            if (request.user.role == 'admin' or (request.user.role == 'team' and organization.id)):
                services = Service.objects.filter(organization=organization)
                serializer = ServiceListSerializer(services, many=True)
                return Response(serializer.data)
        else:
            # Unauthenticated users can only see publicly visible services
            services = Service.objects.filter(organization=organization, publicly_visible=True)
            serializer = ServiceListSerializer(services, many=True)
            return Response(serializer.data)
        
    except Exception as e:
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@permission_classes([IsOrganizationAdminOrTeamWithAccess])
def update_service(request, service_id):
    """Update a service"""
    try:
        service = Service.objects.get(id=service_id)
        if (service.organization.id != request.user.organization.id):
            return Response({
                'error': 'Access denied. You can only update services from your organization.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Store old status for comparison
        old_status = service.current_status
        
        serializer = ServiceUpdateSerializer(
            service, 
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            updated_service = serializer.save()
            response_serializer = ServiceSerializer(updated_service)
            
            # Log timeline event for status change
            log_timeline_event(
                event_type='service_updated',
                user=request.user,
                content_object=updated_service,
                title=f"Service status changed from {old_status} to {updated_service.current_status}",
                description=f"Service '{updated_service.name}' status updated",
                old_value=old_status,
                new_value=updated_service.current_status
                )
            
            return Response(response_serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsOrganizationAdminOrTeamWithAccess])
def delete_service(request, service_id):
    """Delete a service"""
    try:
        service = Service.objects.get(id=service_id)
        if (service.organization.id != request.user.organization.id):
            return Response({
                'error': 'Access denied. You can only delete services from your organization.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        service.delete()
        return Response({
            'message': 'Service deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
        
    except Service.DoesNotExist:
        return Response({
            'error': 'Service not found'
        }, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Incident Views
@api_view(['GET'])
@permission_classes([AllowAny])
@public_endpoint
def list_incidents(request, service_id):
    """List all incidents for a specific service"""
    try:
        # Verify service exists and user has access
        service = Service.objects.get(id=service_id)
        incidents = Incident.objects.filter(service=service)
        serializer = IncidentListSerializer(incidents, many=True)
        return Response(serializer.data)
        
    except Service.DoesNotExist:
        return Response({
            'error': 'Service not found'
        }, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsOrganizationAdminOrTeamWithAccess])
def create_incident(request, service_id):
    """Create a new incident for a specific service"""
    try:
        # Verify service exists and user has access
        service = Service.objects.get(id=service_id)
        if service.organization != request.user.organization:
            return Response({
                'error': 'Access denied. You can only create incidents for services in your organization.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Add service ID to request data
        request.data['serviceId'] = service_id
        
        serializer = IncidentCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            incident = serializer.save()
            response_serializer = IncidentSerializer(incident)
            
            # Log timeline event for incident creation
            log_timeline_event(
                event_type='incident_created',
                user=request.user,
                content_object=incident,
                title=f"Incident created: {incident.title}",
                description=f"New {incident.severity} severity incident created for service '{service.name}'"
            )
            
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except Service.DoesNotExist:
        return Response({
            'error': 'Service not found'
        }, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_incident(request, service_id, incident_id):
    """Update a specific incident"""
    try:
        # Verify service exists and user has access
        service = Service.objects.get(id=service_id)
        if service.organization != request.user.organization:
            return Response({
                'error': 'Access denied. You can only update incidents for services in your organization.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        incident = Incident.objects.get(id=incident_id, service=service)
        
        # Store old values for comparison
        old_status = incident.status
        old_severity = incident.severity
        
        serializer = IncidentUpdateSerializer(
            incident,
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            updated_incident = serializer.save()
            response_serializer = IncidentSerializer(updated_incident)
            
            # Log timeline event for incident update
            log_timeline_event(
                event_type='incident_updated',
                user=request.user,
                content_object=updated_incident,
                title=f"Incident updated: {updated_incident.title}",
                description=f"Incident for service '{service.name}' was updated"
            )
            
            return Response(response_serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Service.DoesNotExist:
        return Response({
            'error': 'Service not found'
        }, status=status.HTTP_404_NOT_FOUND)
        
    except Incident.DoesNotExist:
        return Response({
            'error': 'Incident not found'
        }, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_incident(request, service_id, incident_id):
    """Delete a specific incident"""
    try:
        # Verify service exists and user has access
        service = Service.objects.get(id=service_id)
        if service.organization != request.user.organization:
            return Response({
                'error': 'Access denied. You can only delete incidents for services in your organization.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        incident = Incident.objects.get(id=incident_id, service=service)
        
        # Store incident info before deletion for timeline logging
        incident_title = incident.title
        incident_severity = incident.severity
        
        # Log timeline event for incident deletion
        log_timeline_event(
            event_type='incident_deleted',
            user=request.user,
            content_object=incident,
            title=f"Incident deleted: {incident_title}",
            description=f"{incident_severity} severity incident deleted from service '{service.name}'"
        )
        
        incident.delete()
        
        return Response({
            'message': 'Incident deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
        
    except Service.DoesNotExist:
        return Response({
            'error': 'Service not found'
        }, status=status.HTTP_404_NOT_FOUND)
        
    except Incident.DoesNotExist:
        return Response({
            'error': 'Incident not found'
        }, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

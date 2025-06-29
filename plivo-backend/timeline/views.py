from django.shortcuts import render
from django.contrib.contenttypes.models import ContentType
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Timeline
from services.models import Service, Incident
from users.permissions import IsOrganizationAdmin
from users.views import public_endpoint
from django.db import models

def log_timeline_event(event_type, user, content_object, title, description="", old_value=None, new_value=None):
    """
    Utility function to log timeline events
    
    Args:
        event_type: Type of event (incident_created, incident_updated, etc.)
        user: User performing the action
        content_object: The Service or Incident object
        title: Event title
        description: Event description (optional)
        old_value: Previous value for status changes (optional)
        new_value: New value for status changes (optional)
    """
    try:
        # Determine organization from content object
        if isinstance(content_object, Service):
            organization = content_object.organization
        elif isinstance(content_object, Incident):
            organization = content_object.service.organization
        else:
            raise ValueError("Content object must be Service or Incident")
        
        Timeline.objects.create(
            organization=organization,
            event_type=event_type,
            content_type=ContentType.objects.get_for_model(content_object),
            object_id=content_object.id,
            user=user,
            title=title,
            description=description,
            old_value=old_value,
            new_value=new_value
        )
    except Exception as e:
        # Log error but don't fail the main operation
        print(f"Error logging timeline event: {str(e)}")

@api_view(['GET'])
@permission_classes([AllowAny])
@public_endpoint
def get_timeline(request, org_id):
    """Get timeline events for the user's organization"""
    try:
        # Get timeline events for the user's organization
        timeline_events = Timeline.objects.filter(
            organization=org_id
        ).select_related('user', 'organization')
        
        # Apply filters if provided
        event_type = request.query_params.get('event_type')
        if event_type:
            timeline_events = timeline_events.filter(event_type=event_type)
        
        # Limit results (optional)
        limit = request.query_params.get('limit', 50)
        try:
            limit = int(limit)
            timeline_events = timeline_events[:limit]
        except ValueError:
            timeline_events = timeline_events[:50]
        
        # Convert to dictionary format
        timeline_data = [event.to_dict() for event in timeline_events]
        
        return Response({
            'timeline': timeline_data,
            'count': len(timeline_data)
        })
        
    except Exception as e:
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
@public_endpoint
def get_service_timeline(request, service_id):
    """Get timeline events for a specific service"""
    try:
        # Verify service exists and user has access
        service = Service.objects.get(id=service_id)
        
        # Get timeline events for this service
        service_content_type = ContentType.objects.get_for_model(Service)
        incident_content_type = ContentType.objects.get_for_model(Incident)
        timeline_events = Timeline.objects.filter(
            organization=service.organization
        ).filter(
            models.Q(content_type=service_content_type, object_id=service_id) |
            models.Q(content_type=incident_content_type, object_id__in=service.incidents.values_list('id', flat=True))
        ).select_related('user', 'organization')
        
        
        # Limit results (optional)
        limit = request.query_params.get('limit', 50)
        try:
            limit = int(limit)
            timeline_events = timeline_events[:limit]
        except ValueError:
            timeline_events = timeline_events[:50]
        
        # Convert to dictionary format
        timeline_data = [event.to_dict() for event in timeline_events]
        
        return Response({
            'timeline': timeline_data,
            'count': len(timeline_data)
        })
        
    except Service.DoesNotExist:
        return Response({
            'error': 'Service not found'
        }, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

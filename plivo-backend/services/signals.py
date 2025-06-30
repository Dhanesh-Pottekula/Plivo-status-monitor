from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from .models import Service, Incident
from users.models import Organization
from timeline.models import Timeline
from utils.utils import send_to_ws
import json

# Global variable to store the latest event payload
latest_event_payload = None

def get_latest_event_payload():
    """Get the latest event payload"""
    global latest_event_payload
    return latest_event_payload

def clear_latest_event_payload():
    """Clear the latest event payload"""
    global latest_event_payload
    latest_event_payload = None

@receiver(post_save, sender=Service)
def service_saved(sender, instance, created, **kwargs):
    """Handle Service model save events"""
    global latest_event_payload
    latest_event_payload = {
        "type": "service_updated" if not created else "service_created",
        "data": instance.to_dict(),
        "organization_id": instance.organization_id,
        "room": f"org_{instance.organization.id}_update"
    }
    print(f"📡 Service event prepared: {latest_event_payload['type']}")
    
    # Send to WebSocket server
    send_to_ws(latest_event_payload["room"], latest_event_payload)
    send_to_ws(f"org_{instance.organization_id}_incident_{instance.id}_update", latest_event_payload)


@receiver(post_delete, sender=Service)
def service_deleted(sender, instance, **kwargs):
    """Handle Service model delete events"""
    global latest_event_payload
    latest_event_payload = {
        "type": "service_deleted",
        "data": {"id": instance.id, "organization_id": instance.organization_id},
        "organization_id": instance.organization_id,
        "room": f"org_{instance.organization.id}_update"
    }
    print(f"📡 Service event prepared: {latest_event_payload['type']}")
    
    # Send to WebSocket server
    send_to_ws(latest_event_payload["room"], latest_event_payload)
    send_to_ws(f"org_{instance.organization_id}_incident_{instance.id}_update", latest_event_payload)

@receiver(post_save, sender=Incident)
def incident_saved(sender, instance, created, **kwargs):
    """Handle Incident model save events"""
    global latest_event_payload
    latest_event_payload = {
        "type": "incident_updated" if not created else "incident_created",
        "data": instance.to_dict(),
        "organization_id": instance.service.organization_id,
        "room": f"org_{instance.service.organization_id}_incident_{instance.service.id}_update"
    }
    print(f"📡 Incident event prepared: {latest_event_payload['type']}")
    
    # Send to WebSocket server
    send_to_ws(latest_event_payload["room"], latest_event_payload)

@receiver(post_delete, sender=Incident)
def incident_deleted(sender, instance, **kwargs):
    """Handle Incident model delete events"""
    global latest_event_payload
    latest_event_payload = {
        "type": "incident_deleted",
        "data": {"id": instance.id, "service_id": instance.service_id},
        "organization_id": instance.service.organization_id,
        "room": f"org_{instance.service.organization_id}_incident_{instance.service.id}_update"
    }
    print(f"📡 Incident event prepared: {latest_event_payload['type']}")
    
    # Send to WebSocket server
    send_to_ws(latest_event_payload["room"], latest_event_payload)


    

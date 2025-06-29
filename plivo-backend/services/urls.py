from django.urls import path
from . import views

app_name = 'services'

urlpatterns = [
    # Service CRUD endpoints
    path('services/', views.list_services, name='list_services'),
    path('services/create/', views.create_service, name='create_service'),
    path('services/<str:service_id>/', views.get_service, name='get_service'),
    path('services/<str:service_id>/update/', views.update_service, name='update_service'),
    path('services/<str:service_id>/delete/', views.delete_service, name='delete_service'),
    
    # Incident CRUD endpoints
    path('services/<str:service_id>/incidents/', views.list_incidents, name='list_incidents'),
    path('services/<str:service_id>/incidents/create/', views.create_incident, name='create_incident'),
    path('services/<str:service_id>/incidents/<str:incident_id>/', views.get_incident, name='get_incident'),
    path('services/<str:service_id>/incidents/<str:incident_id>/update/', views.update_incident, name='update_incident'),
    path('services/<str:service_id>/incidents/<str:incident_id>/delete/', views.delete_incident, name='delete_incident'),
] 
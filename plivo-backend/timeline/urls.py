from django.urls import path
from . import views

urlpatterns = [
    path('timeline/', views.get_timeline, name='get_timeline'),
    path('timeline/service/<int:service_id>/', views.get_service_timeline, name='get_service_timeline'),
] 
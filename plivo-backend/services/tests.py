from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Service
from .serializers import ServiceSerializer, ServiceCreateSerializer, ServiceUpdateSerializer
from users.models import Organization

User = get_user_model()


class ServiceModelTest(TestCase):
    def setUp(self):
        self.organization = Organization.objects.create(
            name="Test Organization",
            domain="test.com"
        )
        self.user = User.objects.create_user(
            username="test@test.com",
            email="test@test.com",
            password="testpass123",
            organization=self.organization,
            role="admin"
        )
    
    def test_service_creation(self):
        """Test creating a service with valid data"""
        service = Service.objects.create(
            organization=self.organization,
            name="Test Service",
            description="A test service",
            current_status="operational",
            publicly_visible=True
        )
        
        self.assertEqual(service.name, "Test Service")
        self.assertEqual(service.organization, self.organization)
        self.assertEqual(service.current_status, "operational")
        self.assertTrue(service.publicly_visible)
        self.assertTrue(service.id.startswith("svc_"))
    
    def test_service_to_dict(self):
        """Test the to_dict method"""
        service = Service.objects.create(
            organization=self.organization,
            name="Test Service",
            description="A test service",
            current_status="operational",
            publicly_visible=True
        )
        
        service_dict = service.to_dict()
        
        self.assertEqual(service_dict["name"], "Test Service")
        self.assertEqual(service_dict["currentStatus"], "operational")
        self.assertTrue(service_dict["publiclyVisible"])
        self.assertEqual(service_dict["organizationId"], f"org_{self.organization.id}")


class ServiceSerializerTest(TestCase):
    def setUp(self):
        self.organization = Organization.objects.create(
            name="Test Organization",
            domain="test.com"
        )
        self.user = User.objects.create_user(
            username="test@test.com",
            email="test@test.com",
            password="testpass123",
            organization=self.organization,
            role="admin"
        )
    
    def test_valid_service_creation_data(self):
        """Test serializer with valid creation data"""
        data = {
            "organizationId": f"org_{self.organization.id}",
            "name": "Test Service",
            "description": "A test service",
            "currentStatus": "operational",
            "publiclyVisible": True
        }
        
        serializer = ServiceCreateSerializer(data=data, context={'request': type('obj', (object,), {'user': self.user})()})
        self.assertTrue(serializer.is_valid())
    
    def test_invalid_organization_id(self):
        """Test serializer with invalid organization ID"""
        data = {
            "organizationId": "invalid_org_id",
            "name": "Test Service",
            "description": "A test service"
        }
        
        serializer = ServiceCreateSerializer(data=data, context={'request': type('obj', (object,), {'user': self.user})()})
        self.assertFalse(serializer.is_valid())
        self.assertIn('organizationId', serializer.errors)
    
    def test_missing_required_fields(self):
        """Test serializer with missing required fields"""
        data = {
            "description": "A test service"
        }
        
        serializer = ServiceCreateSerializer(data=data, context={'request': type('obj', (object,), {'user': self.user})()})
        self.assertFalse(serializer.is_valid())
        self.assertIn('organizationId', serializer.errors)
        self.assertIn('name', serializer.errors)
    
    def test_invalid_status(self):
        """Test serializer with invalid status"""
        data = {
            "organizationId": f"org_{self.organization.id}",
            "name": "Test Service",
            "currentStatus": "invalid_status"
        }
        
        serializer = ServiceCreateSerializer(data=data, context={'request': type('obj', (object,), {'user': self.user})()})
        self.assertFalse(serializer.is_valid())
        self.assertIn('currentStatus', serializer.errors)
    
    def test_name_validation(self):
        """Test name field validation"""
        # Test empty name
        data = {
            "organizationId": f"org_{self.organization.id}",
            "name": "",
            "description": "A test service"
        }
        
        serializer = ServiceCreateSerializer(data=data, context={'request': type('obj', (object,), {'user': self.user})()})
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)
        
        # Test name too short
        data["name"] = "A"
        serializer = ServiceCreateSerializer(data=data, context={'request': type('obj', (object,), {'user': self.user})()})
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)
        
        # Test name too long
        data["name"] = "A" * 201
        serializer = ServiceCreateSerializer(data=data, context={'request': type('obj', (object,), {'user': self.user})()})
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)


class ServiceAPITest(APITestCase):
    def setUp(self):
        self.organization = Organization.objects.create(
            name="Test Organization",
            domain="test.com"
        )
        self.user = User.objects.create_user(
            username="test@test.com",
            email="test@test.com",
            password="testpass123",
            organization=self.organization,
            role="admin"
        )
        self.client.force_authenticate(user=self.user)
    
    def test_create_service(self):
        """Test creating a service via API"""
        data = {
            "organizationId": f"org_{self.organization.id}",
            "name": "Test Service",
            "description": "A test service",
            "currentStatus": "operational",
            "publiclyVisible": True
        }
        
        response = self.client.post('/api/services/create/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify the response data
        self.assertEqual(response.data['name'], "Test Service")
        self.assertEqual(response.data['currentStatus'], "operational")
        self.assertTrue(response.data['publiclyVisible'])
        self.assertTrue(response.data['id'].startswith("svc_"))
    
    def test_create_service_invalid_data(self):
        """Test creating a service with invalid data"""
        data = {
            "organizationId": "invalid_org",
            "name": "",
            "currentStatus": "invalid_status"
        }
        
        response = self.client.post('/api/services/create/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Check for specific validation errors
        self.assertIn('organizationId', response.data)
        self.assertIn('name', response.data)
        self.assertIn('currentStatus', response.data)
    
    def test_list_services(self):
        """Test listing services"""
        # Create a test service
        Service.objects.create(
            organization=self.organization,
            name="Test Service",
            description="A test service",
            current_status="operational",
            publicly_visible=True
        )
        
        response = self.client.get('/api/services/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['services']), 1)
        self.assertEqual(response.data['services'][0]['name'], "Test Service")
    
    def test_get_service(self):
        """Test getting a specific service"""
        service = Service.objects.create(
            organization=self.organization,
            name="Test Service",
            description="A test service",
            current_status="operational",
            publicly_visible=True
        )
        
        response = self.client.get(f'/api/services/{service.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Test Service")
    
    def test_update_service(self):
        """Test updating a service"""
        service = Service.objects.create(
            organization=self.organization,
            name="Test Service",
            description="A test service",
            current_status="operational",
            publicly_visible=True
        )
        
        update_data = {
            "name": "Updated Service",
            "currentStatus": "degraded_performance"
        }
        
        response = self.client.patch(f'/api/services/{service.id}/update/', update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Updated Service")
        self.assertEqual(response.data['currentStatus'], "degraded_performance")
    
    def test_delete_service(self):
        """Test deleting a service"""
        service = Service.objects.create(
            organization=self.organization,
            name="Test Service",
            description="A test service",
            current_status="operational",
            publicly_visible=True
        )
        
        response = self.client.delete(f'/api/services/{service.id}/delete/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify the service is deleted
        self.assertFalse(Service.objects.filter(id=service.id).exists())

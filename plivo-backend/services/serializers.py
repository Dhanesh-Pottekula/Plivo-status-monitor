from rest_framework import serializers
from .models import Service
from users.models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    """Serializer for Organization model"""
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Organization
        fields = ['id', 'name', 'domain']
    
    def get_id(self, obj):
        """Return organization ID in the format org_xyz_corp"""
        return f"org_{obj.id}"


class ServiceSerializer(serializers.ModelSerializer):
    """Main serializer for Service model"""
    organizationId = serializers.CharField(write_only=True, required=True)
    organization = OrganizationSerializer(read_only=True)
    currentStatus = serializers.ChoiceField(
        choices=Service.STATUS_CHOICES,
        source='current_status',
        default='operational'
    )
    publiclyVisible = serializers.BooleanField(
        source='publicly_visible',
        default=True
    )
    createdAt = serializers.DateTimeField(
        source='created_at',
        read_only=True,
        format='%Y-%m-%dT%H:%M:%SZ'
    )
    updatedAt = serializers.DateTimeField(
        source='updated_at',
        read_only=True,
        format='%Y-%m-%dT%H:%M:%SZ'
    )
    
    class Meta:
        model = Service
        fields = [
            'id', 'organizationId', 'organization', 'name', 'description',
            'currentStatus', 'publiclyVisible', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']
    
    def validate_organizationId(self, value):
        """Validate organization ID format and existence"""
        if not value.startswith('org_'):
            raise serializers.ValidationError(
                'Invalid organization ID format. Expected format: org_xyz_corp'
            )
        
        try:
            org_id = int(value[4:])  # Remove 'org_' prefix
            organization = Organization.objects.get(id=org_id)
            return organization
        except (ValueError, Organization.DoesNotExist):
            raise serializers.ValidationError('Organization not found')
    
    def validate_name(self, value):
        """Validate service name"""
        if not value or not value.strip():
            raise serializers.ValidationError('Service name cannot be empty')
        
        if len(value.strip()) < 2:
            raise serializers.ValidationError('Service name must be at least 2 characters long')
        
        if len(value) > 200:
            raise serializers.ValidationError('Service name cannot exceed 200 characters')
        
        return value.strip()
    
    def validate_description(self, value):
        """Validate service description"""
        if value and len(value) > 1000:
            raise serializers.ValidationError('Description cannot exceed 1000 characters')
        return value
    
    def validate(self, data):
        """Additional validation for the entire object"""
        # Check if user has access to the organization
        request = self.context.get('request')
        if request and request.user:
            organization = data.get('organizationId') or data.get('organization')
            if organization and request.user.organization != organization and not request.user.is_admin:
                raise serializers.ValidationError(
                    'Access denied. You can only create services for your organization.'
                )
        
        return data
    
    def create(self, validated_data):
        """Create a new service"""
        organization = validated_data.pop('organizationId')
        validated_data['organization'] = organization
        
        return Service.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        """Update an existing service"""
        if 'organizationId' in validated_data:
            organization = validated_data.pop('organizationId')
            validated_data['organization'] = organization
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance


class ServiceListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing services"""
    organizationId = serializers.SerializerMethodField()
    currentStatus = serializers.CharField(source='current_status')
    publiclyVisible = serializers.BooleanField(source='publicly_visible')
    createdAt = serializers.DateTimeField(
        source='created_at',
        format='%Y-%m-%dT%H:%M:%SZ'
    )
    updatedAt = serializers.DateTimeField(
        source='updated_at',
        format='%Y-%m-%dT%H:%M:%SZ'
    )
    
    class Meta:
        model = Service
        fields = [
            'id', 'organizationId', 'name', 'description',
            'currentStatus', 'publiclyVisible', 'createdAt', 'updatedAt'
        ]
    
    def get_organizationId(self, obj):
        """Return organization ID in the format org_xyz_corp"""
        return f"org_{obj.organization.id}"


class ServiceCreateSerializer(serializers.ModelSerializer):
    """Serializer specifically for creating services"""
    organizationId = serializers.CharField(required=True)
    currentStatus = serializers.ChoiceField(
        choices=Service.STATUS_CHOICES,
        source='current_status',
        default='operational'
    )
    publiclyVisible = serializers.BooleanField(
        source='publicly_visible',
        default=True
    )
    
    class Meta:
        model = Service
        fields = [
            'organizationId', 'name', 'description',
            'currentStatus', 'publiclyVisible'
        ]
    
    def validate_organizationId(self, value):
        """Validate organization ID format and existence"""
        try:
            organization = Organization.objects.get(id=value)
            return organization
        except (ValueError, Organization.DoesNotExist):
            raise serializers.ValidationError('Organization not found')
    
    def create(self, validated_data):
        """Create a new service"""
        organization = validated_data.pop('organizationId')
        validated_data['organization'] = organization
        
        return Service.objects.create(**validated_data)


class ServiceUpdateSerializer(serializers.ModelSerializer):
    """Serializer specifically for updating services"""
    currentStatus = serializers.ChoiceField(
        choices=Service.STATUS_CHOICES,
        source='current_status',
        required=False
    )
    publiclyVisible = serializers.BooleanField(
        source='publicly_visible',
        required=False
    )
    
    class Meta:
        model = Service
        fields = [
            'name', 'description', 'currentStatus', 'publiclyVisible'
        ]
    
    def validate_name(self, value):
        """Validate service name"""
        if value is not None:
            if not value.strip():
                raise serializers.ValidationError('Service name cannot be empty')
            
            if len(value.strip()) < 2:
                raise serializers.ValidationError('Service name must be at least 2 characters long')
            
            if len(value) > 200:
                raise serializers.ValidationError('Service name cannot exceed 200 characters')
            
            return value.strip()
        return value 
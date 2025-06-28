import re
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from .models import User


def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_phone(phone):
    """Validate phone number format"""
    if not phone:
        return True
    pattern = r'^\+?1?\d{9,15}$'
    return re.match(pattern, phone) is not None


def validate_password(password):
    """Validate password requirements"""
    if not password:
        return False, "Password is required"
    
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    return True, None


def validate_passwords_match(password, confirm_password):
    """Validate that password and confirm password match"""
    if not confirm_password:
        return False, "Confirm password is required"
    
    if password != confirm_password:
        return False, "Passwords don't match"
    
    return True, None


def validate_full_name(full_name):
    """Validate full name requirements"""
    if not full_name:
        return False, "Full name is required"
    
    full_name_parts = full_name.strip().split(' ', 1)
    first_name = full_name_parts[0] if full_name_parts else ''
    last_name = full_name_parts[1] if len(full_name_parts) > 1 else ''
    
    if len(first_name) > 30:
        return False, "First name cannot exceed 30 characters"
    
    if len(last_name) > 30:
        return False, "Last name cannot exceed 30 characters"
    
    return True, None


def validate_organization_name(organization_name):
    """Validate organization name requirements"""
    if not organization_name:
        return False, "Organization name is required"
    
    return True, None


def validate_user_role(role):
    """Validate user role"""
    if role not in dict(User.USER_ROLES):
        return False, "Invalid role"
    
    return True, None


def validate_user_exists(email):
    """Check if user with given email already exists"""
    if User.objects.filter(email=email).exists():
        return False, "A user with this email already exists"
    
    return True, None


def validate_organization_exists(name):
    """Check if organization with given name already exists"""
    from .models import Organization
    
    if Organization.objects.filter(name=name).exists():
        return False, "An organization with this name already exists"
    
    return True, None


def validate_profile_fields(data):
    """Validate profile update fields"""
    errors = {}
    
    if 'first_name' in data and len(data['first_name']) > 30:
        errors['first_name'] = 'First name cannot exceed 30 characters'
    
    if 'last_name' in data and len(data['last_name']) > 30:
        errors['last_name'] = 'Last name cannot exceed 30 characters'
    
    if 'phone' in data:
        if data['phone'] and not validate_phone(data['phone']):
            errors['phone'] = "Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
        if data['phone'] and len(data['phone']) > 15:
            errors['phone'] = 'Phone number cannot exceed 15 characters'
    
    if 'address' in data and data['address'] and len(data['address']) > 500:
        errors['address'] = 'Address cannot exceed 500 characters'
    
    if 'city' in data and data['city'] and len(data['city']) > 100:
        errors['city'] = 'City cannot exceed 100 characters'
    
    if 'state' in data and data['state'] and len(data['state']) > 100:
        errors['state'] = 'State cannot exceed 100 characters'
    
    if 'zip_code' in data and data['zip_code'] and len(data['zip_code']) > 10:
        errors['zip_code'] = 'Zip code cannot exceed 10 characters'
    
    return errors


def validate_signup_data(data):
    """Validate all signup data fields"""
    errors = {}
    
    # Required fields validation
    if not data.get('email'):
        errors['email'] = 'Email is required'
    elif not validate_email(data['email']):
        errors['email'] = 'Invalid email format'
    
    # Password validation
    password_valid, password_error = validate_password(data.get('password'))
    if not password_valid:
        errors['password'] = password_error
    
    # Confirm password validation
    if password_valid:
        confirm_valid, confirm_error = validate_passwords_match(data.get('password'), data.get('confirm_password'))
        if not confirm_valid:
            errors['confirm_password'] = confirm_error
    
    # Full name validation
    full_name_valid, full_name_error = validate_full_name(data.get('full_name'))
    if not full_name_valid:
        errors['full_name'] = full_name_error
    
    # Organization name validation
    org_valid, org_error = validate_organization_name(data.get('organization_name'))
    if not org_valid:
        errors['organization_name'] = org_error
    
    # Role validation
    role_valid, role_error = validate_user_role(data.get('role', 'user'))
    if not role_valid:
        errors['role'] = role_error
    
    # User existence validation (only if email is valid)
    if not errors.get('email') and data.get('email'):
        user_exists_valid, user_exists_error = validate_user_exists(data['email'])
        if not user_exists_valid:
            errors['email'] = user_exists_error
    
    return errors


def validate_login_data(data):
    """Validate login data fields"""
    errors = {}
    
    if not data.get('email'):
        errors['email'] = 'Email is required'
    elif not validate_email(data['email']):
        errors['email'] = 'Invalid email format'
    
    if not data.get('password'):
        errors['password'] = 'Password is required'
    
    return errors


def validate_organization_data(data):
    """Validate organization creation data"""
    errors = {}
    
    if not data.get('name'):
        errors['name'] = 'Organization name is required'
    else:
        org_exists_valid, org_exists_error = validate_organization_exists(data['name'])
        if not org_exists_valid:
            errors['name'] = org_exists_error
    
    return errors 
from rest_framework.permissions import BasePermission

class IsOrganizationAdmin(BasePermission):
    def has_permission(self, request, view):
        if(not request.user):
            return False
        return request.user.is_organization_admin

class IsOrganizationAdminOrTeamWithAccess(BasePermission):
    """Allows organization admins or team members with access"""
    def has_permission(self, request, view):
        if(not request.user):
            return False
        return request.user.is_organization_admin or (request.user.role == 'team' and request.user.has_access)
    
class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        if(not request.user):
            return False
        return request.user.role == 'admin'

class IsTeamMember(BasePermission):
    def has_permission(self, request, view):
        if(not request.user):
            return False
        return request.user.role == 'team'

class IsTeamMemberWithAccess(BasePermission):
    def has_permission(self, request, view):
        if(not request.user):
            return False
        return request.user.role == 'team' and request.user.has_access

class IsAdminOrAuthenticated(BasePermission):
    """
    Allows access to admin users or any authenticated user.
    Useful for views that have different behavior based on user role.
    """
    def has_permission(self, request, view):
        if(not request.user):
            return False
        return request.user.is_authenticated
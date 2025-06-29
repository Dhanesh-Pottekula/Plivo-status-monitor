import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { OrganizationInterface } from '@/_constants/Interfaces/OrganizationInterfaces';


interface OrganizationCardProps {
  organization: OrganizationInterface;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Organization:  {organization.name}
            </CardTitle>
           
          </div>
          <Badge 
            variant={organization.is_active ? "default" : "destructive"}
            className="text-xs px-2 py-1"
          >
            {organization.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Domain */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-600">Domain</span>
            <span className="text-xs text-gray-800 mt-0.5">
              {organization.domain || 'Not specified'}
            </span>
          </div>

          {/* User Count */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-600">Total Users</span>
            <span className="text-xs text-gray-800 mt-0.5">
              {organization.user_count || 0}
            </span>
          </div>

          {/* Active User Count */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-600">Active Users</span>
            <span className="text-xs text-gray-800 mt-0.5">
              {organization.active_user_count || 0}
            </span>
          </div>

          {/* Created Date */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-600">Created</span>
            <span className="text-xs text-gray-800 mt-0.5">
              {formatDate(organization.created_at)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationCard; 
import { useOrganizations } from "@/hooks/useOrganizations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { OrganizationInterface } from "@/_constants/Interfaces/OrganizationInterfaces";
import MainLayout from "./MainLayout";

function OrganizationsList() {
  const { organizations, handleOrgClick, formatDate } = useOrganizations();

  return (
    <MainLayout>
      {Array.isArray(organizations) && organizations.length > 0 ? (
        <div className="p-6 flex flex-col justify-between items-between h-full">
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Organizations
              </h1>
              <p className="text-gray-600">
                Manage and view all organizations in your system
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
              {organizations.map((org: OrganizationInterface) => (
                <Card
                  onClick={() => handleOrgClick(org.id)}
                  key={org.id}
                  className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {org.name}
                      </CardTitle>
                      <Badge
                        variant={org.is_active ? "default" : "secondary"}
                        className="ml-2 flex-shrink-0"
                      >
                        {org.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Domain */}
                    {org.domain && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                          Domain:
                        </span>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {org.domain}
                        </span>
                      </div>
                    )}

                    {/* User Statistics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {org.user_count || 0}
                        </div>
                        <div className="text-xs text-blue-500">
                          Total Members
                        </div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {org.active_user_count || 0}
                        </div>
                        <div className="text-xs text-green-500">
                          Active Members
                        </div>
                      </div>
                    </div>

                    {/* Creation Date */}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Created:</span>
                        <span>{formatDate(org.created_at)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <span>Updated:</span>
                        <span>{formatDate(org.updated_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 mb-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-md font-bold text-gray-700">
                Total Organizations: {organizations.length}
              </span>
              <span className="text-md font-bold text-gray-600">
                Active: {organizations.filter((org) => org.is_active).length}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              No Organizations Found
            </h2>
            <p className="text-gray-500">
              There are no organizations to display.
            </p>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default OrganizationsList;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Building2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  getServiceDetialAction,
  updateServiceAction,
  deleteServiceAction,
} from "@/_redux/actions/services.actions";
import { SERVICE_STATUS_OPTIONS } from "@/_constants/Interfaces/ServicesInterface";
import { type ServiceStatusType } from "@/_constants/Interfaces/ServicesInterface";
import { type AppDispatch, type RootState } from "@/_redux/store";
import MainLayout from "./MainLayout";
import {
  EditServiceModal,
  DeleteServiceModal,
  IncidentsList,
} from "@/components/ServicesPage";
import { type ServiceFormData } from "@/components/ServicesPage/types";
import { getStatusBadgeVariant } from "@/_helpers/commonFunctions";
import TimelineComponent from "@/components/TimelineComponent";
import { useAuth } from "@/_contexts/AuthContext";
import { useRoomSocket } from "@/hooks/useRoomSocket";
import { SOCKET_ROOM_INCIDENT_UPDATE } from "@/_constants/socketConstants";
import wsManager from "@/lib/ws_socket";
import { getTimeLineOfOrganizationAction } from "@/_redux/actions/timeline.actions";

function ServiceDetailsPage() {
  const { service_id } = useParams<{ service_id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { is_have_edit_access } = useAuth();
  const { service, loading } = useSelector(
    (state: RootState) => state.getServiceDetailsReducer
  );

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    currentStatus: "operational",
    publiclyVisible: true,
  });

  // for incident updates
  useRoomSocket(
    SOCKET_ROOM_INCIDENT_UPDATE(
      service?.organization?.id || "",
      service_id || ""
    )
  );

  useEffect(() => {
    if (service_id) {
      dispatch(getServiceDetialAction(parseInt(service_id)));
    }
  }, [dispatch, service_id]);

  // Update form data when service changes
  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        currentStatus: service.currentStatus,
        publiclyVisible: service.publiclyVisible,
      });
    }
  }, [service]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleUpdateService = async () => {
    if (!service) return;

    try {
      await dispatch(updateServiceAction(service.id, formData));
      setIsEditModalOpen(false);
      // WebSocket will handle refreshing the service details and timeline
      if(!wsManager.isSocketConnected() ){
        await dispatch(getTimeLineOfOrganizationAction(service?.organization?.id||""));
        dispatch(getServiceDetialAction(parseInt(service_id||"")));
       }
    } catch (error) {
      console.error("Failed to update service:", error);
    }
  };

  const handleDeleteService = async () => {
    if (!service) return;

    try {
      await dispatch(deleteServiceAction(service.id));
      setIsDeleteModalOpen(false);
      // Navigate back to services page after deletion
      if(!wsManager.isSocketConnected() ){
        await dispatch(getTimeLineOfOrganizationAction(service?.organization?.id||""));
        dispatch(getServiceDetialAction(parseInt(service_id||"")));
       }
      navigate("/services");
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-3 text-sm text-gray-600">
              Loading service details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      {service && (
        <>
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  size="sm"
                  className="h-8 w-fit"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <div className="min-w-0 flex-1">
                  <h1 className="text-md sm:text-2xl font-semibold text-gray-900 ">
                    {service.name} Service
                  </h1>
                </div>
              </div>
              {is_have_edit_access && (
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="outline"
                    size="sm"
                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              )}
            </div>

              {/* Main Service Information */}
              <div className="lg:col-span-2">
                <Card className="h-fit">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-lg">
                      <span>Service Information</span>
                      <div className="flex items-center space-x-2">
                        {service.publiclyVisible ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                        <Badge
                          variant={getStatusBadgeVariant(
                            service.currentStatus as ServiceStatusType
                          )}
                          className="text-xs"
                        >
                          {
                            SERVICE_STATUS_OPTIONS.find(
                              (opt) => opt.value === service.currentStatus
                            )?.label
                          }
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Organization Information */}
                    <div>
                      <h3 className="font-bold text-md text-gray-700 mb-3 flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-gray-600 flex-shrink-0" />
                        Organization
                      </h3>
                      <div className="space-y-3 sm:space-y-0 sm:flex sm:justify-between sm:items-start sm:gap-6">
                        {service.organization ? (
                          <>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-md text-gray-700 mb-1">
                                Name
                              </h4>
                              <p className="text-sm text-gray-900 truncate">
                                {service.organization.name}
                              </p>
                            </div>
                            {service.organization.domain && (
                              <div className="flex-1 min-w-0 sm:text-right">
                                <h4 className="font-medium text-sm text-gray-700 mb-1 flex items-center sm:justify-end">
                                  <Globe className="h-3 w-3 mr-1 flex-shrink-0" />
                                  Domain
                                </h4>
                                <p className="text-sm text-gray-900 font-mono break-all">
                                  {service.organization.domain}
                                </p>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-sm text-gray-500">
                            Organization details not available
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-bold text-md text-gray-700 mb-1">
                        Description
                      </h3>
                      <p className="text-sm text-gray-900 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Incidents Section */}
              <div className="lg:col-span-12">
                <Card className="h-fit">
                
                  <CardContent className="p-3">
                    <IncidentsList serviceId={service.id} />
                  </CardContent>
                </Card>
              </div>


            {/* Service Timeline - Full Width */}
            <div className="mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Service Timeline</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <TimelineComponent
                    serviceId={service.id}
                    title=""
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Edit Modal */}
          <EditServiceModal
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateService}
          />

          {/* Delete Confirmation Modal */}
          <DeleteServiceModal
            isOpen={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            selectedService={service}
            onConfirm={handleDeleteService}
          />
        </>
      )}
    </MainLayout>
  );
}

export default ServiceDetailsPage;

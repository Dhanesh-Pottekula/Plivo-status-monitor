import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getServiceDetialAction, updateServiceAction, deleteServiceAction } from "@/_redux/actions/services.actions";  
import { SERVICE_STATUS_OPTIONS } from "@/_constants/Interfaces/ServicesInterface";
import { type ServiceStatusType } from "@/_constants/Interfaces/ServicesInterface";
import { type AppDispatch, type RootState } from "@/_redux/store";
import MainLayout from "./MainLayout";
import { EditServiceModal, DeleteServiceModal, IncidentsList } from "@/components/ServicesPage";
import { type ServiceFormData } from "@/components/ServicesPage/types";
import { formatDate, getStatusBadgeVariant } from "@/_helpers/commonFunctions";

function ServiceDetailsPage() {
  const { service_id } = useParams<{ service_id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { service, loading } = useSelector((state: RootState) => state.getServiceDetailsReducer);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    currentStatus: "operational",
    publiclyVisible: true,
  });

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
      // Refresh service details
      if (service_id) {
        dispatch(getServiceDetialAction(parseInt(service_id)));
      }
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

  const handleDeleteService = async () => {
    if (!service) return;
    
    try {
      await dispatch(deleteServiceAction(service.id));
      setIsDeleteModalOpen(false);
      // Navigate back to services page after deletion
      navigate('/services');
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading service details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (  
    <MainLayout>
      {service && (
        <>
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Button onClick={handleBack} variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">{service.name}</h1>
                  <p className="text-gray-600">Service Details</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={handleEdit} variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button onClick={handleDelete} variant="outline" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Main Service Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Service Information
                    <div className="flex items-center space-x-2">
                      {service.publiclyVisible ? (
                        <Eye className="h-5 w-5 text-green-600" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      )}
                      <Badge variant={getStatusBadgeVariant(service.currentStatus as ServiceStatusType)}>
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
                  <div>
                    <h3 className="font-semibold text-sm text-gray-700 mb-1">Description</h3>
                    <p className="text-gray-900">{service.description}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-700 mb-1">Service ID</h3>
                      <p className="text-gray-900">#{service.id}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-700 mb-1">Organization ID</h3>
                      <p className="text-gray-900">{service.organizationId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timestamps */}
              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-700 mb-1">Created</h3>
                    <p className="text-gray-900">{formatDate(service.createdAt)}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold text-sm text-gray-700 mb-1">Last Updated</h3>
                    <p className="text-gray-900">{formatDate(service.updatedAt)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Incidents Section */}
            <div className="mt-8">
              <IncidentsList serviceId={service.id} />
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
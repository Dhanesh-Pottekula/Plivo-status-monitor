import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Edit, Trash2, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreateIncidentModal, 
  EditIncidentModal, 
  DeleteIncidentModal 
} from "./index";
import { 
  getIncidentsAction, 
  createIncidentAction, 
  updateIncidentAction, 
  deleteIncidentAction 
} from "@/_redux/actions/services.actions";
import { 
  INCIDENT_STATUS_OPTIONS, 
  INCIDENT_SEVERITY_OPTIONS,
  type IncidentInterface 
} from "@/_constants/Interfaces/ServicesInterface";
import { type IncidentFormData } from "./types";
import { type AppDispatch, type RootState } from "@/_redux/store";
import { formatDate, getStatusBadgeVariant } from "@/_helpers/commonFunctions";

interface IncidentsListProps {
  serviceId: number;
}

function IncidentsList({ serviceId }: IncidentsListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { incidents, loading } = useSelector((state: RootState) => state.getIncidentsReducer);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentInterface | null>(null);
  const [formData, setFormData] = useState<IncidentFormData>({
    title: "",
    description: "",
    status: "investigating",
    severity: "medium",
  });

  useEffect(() => {
    if (serviceId) {
      dispatch(getIncidentsAction(serviceId));
    }
  }, [dispatch, serviceId]);

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "low":
        return "default";
      case "medium":
        return "secondary";
      case "high":
        return "destructive";
      case "critical":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "investigating":
        return <Clock className="h-4 w-4" />;
      case "identified":
        return <AlertTriangle className="h-4 w-4" />;
      case "monitoring":
        return <AlertTriangle className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleCreateIncident = async () => {
    try {
      await dispatch(createIncidentAction(serviceId, formData));
      setIsCreateModalOpen(false);
      setFormData({
        title: "",
        description: "",
        status: "investigating",
        severity: "medium",
      });
      // Refresh incidents list
      dispatch(getIncidentsAction(serviceId));
    } catch (error) {
      console.error('Failed to create incident:', error);
    }
  };

  const handleEditIncident = async () => {
    if (!selectedIncident) return;
    
    try {
      await dispatch(updateIncidentAction(serviceId, selectedIncident.id, formData));
      setIsEditModalOpen(false);
      setSelectedIncident(null);
      setFormData({
        title: "",
        description: "",
        status: "investigating",
        severity: "medium",
      });
      // Refresh incidents list
      dispatch(getIncidentsAction(serviceId));
    } catch (error) {
      console.error('Failed to update incident:', error);
    }
  };

  const handleDeleteIncident = async () => {
    if (!selectedIncident) return;
    
    try {
      await dispatch(deleteIncidentAction(serviceId, selectedIncident.id));
      setIsDeleteModalOpen(false);
      setSelectedIncident(null);
      // Refresh incidents list
      dispatch(getIncidentsAction(serviceId));
    } catch (error) {
      console.error('Failed to delete incident:', error);
    }
  };

  const openEditModal = (incident: IncidentInterface) => {
    setSelectedIncident(incident);
    setFormData({
      title: incident.title,
      description: incident.description,
      status: incident.status,
      severity: incident.severity,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (incident: IncidentInterface) => {
    setSelectedIncident(incident);
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading incidents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Incidents</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Incident
        </Button>
      </div>

      {/* Incidents List */}
      {incidents && incidents.length > 0 ? (
        <div className="space-y-4">
          {incidents.map((incident) => (
            <Card key={incident.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(incident.status)}
                    <span>{incident.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusBadgeVariant(incident.status)}>
                      {
                        INCIDENT_STATUS_OPTIONS.find(
                          (opt) => opt.value === incident.status
                        )?.label
                      }
                    </Badge>
                    <Badge variant={getSeverityBadgeVariant(incident.severity)}>
                      {
                        INCIDENT_SEVERITY_OPTIONS.find(
                          (opt) => opt.value === incident.severity
                        )?.label
                      }
                    </Badge>
                    <Button
                      onClick={() => openEditModal(incident)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => openDeleteModal(incident)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">{incident.description}</p>
                <Separator className="my-3" />
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold">Created by:</span> {incident.createdBy}
                  </div>
                  <div>
                    <span className="font-semibold">Created:</span> {formatDate(incident.createdAt)}
                  </div>
                  {incident.resolvedAt && (
                    <div>
                      <span className="font-semibold">Resolved:</span> {formatDate(incident.resolvedAt)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No incidents yet</h3>
            <p className="text-gray-500 text-center mb-4">
              There are no incidents reported for this service.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Incident
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      <CreateIncidentModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateIncident}
      />

      {/* Edit Modal */}
      <EditIncidentModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditIncident}
      />

      {/* Delete Confirmation Modal */}
      <DeleteIncidentModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        selectedIncident={selectedIncident}
        onConfirm={handleDeleteIncident}
      />
    </div>
  );
}

export default IncidentsList; 
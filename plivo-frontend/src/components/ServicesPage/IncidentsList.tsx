import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Edit, Trash2, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { useAuth } from "@/_contexts/AuthContext";
import { getTimeLineOfServiceAction } from "@/_redux/actions/timeline.actions";

interface IncidentsListProps {
  serviceId: number;
}

function IncidentsList({ serviceId }: IncidentsListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { incidents, loading } = useSelector((state: RootState) => state.getIncidentsReducer);
  const { is_have_edit_access } = useAuth();
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
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Incidents</h2>
        {is_have_edit_access && <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
          <Plus className="h-3 w-3 mr-1" />
          Create Incident
        </Button>}
      </div>

      {/* Incidents List */}
      {incidents && incidents.length > 0 ? (
        <div className="space-y-2">
          {incidents.map((incident) => (
            <Card key={incident.id} className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(incident.status)}
                    <span className="font-medium">{incident.title}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Badge variant={getStatusBadgeVariant(incident.status)} className="text-xs">
                      {
                        INCIDENT_STATUS_OPTIONS.find(
                          (opt) => opt.value === incident.status
                        )?.label
                      }
                    </Badge>
                    <Badge variant={getSeverityBadgeVariant(incident.severity)} className="text-xs">
                      {
                        INCIDENT_SEVERITY_OPTIONS.find(
                          (opt) => opt.value === incident.severity
                        )?.label
                      }
                    </Badge>
                    {is_have_edit_access && <Button
                      onClick={() => openEditModal(incident)}
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>}
                  {is_have_edit_access && <Button
                      onClick={() => openDeleteModal(incident)}
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{incident.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>By {incident.createdBy}</span>
                    <span>Created {formatDate(incident.createdAt)}</span>
                    {incident.resolvedAt && (
                      <span>Resolved {formatDate(incident.resolvedAt)}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-6">
            <AlertTriangle className="h-8 w-8 text-gray-400 mb-2" />
            <h3 className="text-sm font-medium text-gray-600 mb-1">No incidents yet</h3>
            <p className="text-xs text-gray-500 text-center mb-3">
              There are no incidents reported for this service.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
              <Plus className="h-3 w-3 mr-1" />
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
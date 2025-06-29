import {
  INCIDENT_STATUS_OPTIONS,
  INCIDENT_SEVERITY_OPTIONS,
} from "@/_constants/Interfaces/ServicesInterface";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { type IncidentFormData, type IncidentStatusType, type IncidentSeverityType } from "./types";

interface CreateIncidentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: IncidentFormData;
  setFormData: (data: IncidentFormData) => void;
  onSubmit: () => void;
}

function CreateIncidentModal({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
}: CreateIncidentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Incident</DialogTitle>
          <DialogDescription>
            Create a new incident for this service.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="create-title">Incident Title</Label>
            <Input
              id="create-title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter incident title"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="create-description">Description</Label>
            <Input
              id="create-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter incident description"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="create-status">Status</Label>
            <Select
              id="create-status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as IncidentStatusType,
                })
              }
            >
              {INCIDENT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="create-severity">Severity</Label>
            <Select
              id="create-severity"
              value={formData.severity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  severity: e.target.value as IncidentSeverityType,
                })
              }
            >
              {INCIDENT_SEVERITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!formData.title.trim() || !formData.description.trim()}>
            Create Incident
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateIncidentModal; 
import {
  SERVICE_STATUS_OPTIONS,
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
import { type ServiceFormData, type ServiceStatusType } from "./types";

interface EditServiceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ServiceFormData;
  setFormData: (data: ServiceFormData) => void;
  onSubmit: () => void;
}

function EditServiceModal({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
}: EditServiceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>
            Update the service details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Service Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter service name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Description</Label>
            <Input
              id="edit-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter service description"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-status">Current Status</Label>
            <Select
              id="edit-status"
              value={formData.currentStatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  currentStatus: e.target.value as ServiceStatusType,
                })
              }
            >
              {SERVICE_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="edit-publiclyVisible"
              checked={formData.publiclyVisible}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  publiclyVisible: e.target.checked,
                })
              }
              className="rounded"
            />
            <Label htmlFor="edit-publiclyVisible">Publicly Visible</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!formData.name.trim()}>
            Update Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditServiceModal; 
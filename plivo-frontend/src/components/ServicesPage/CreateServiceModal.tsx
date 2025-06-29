import { Plus } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { type ServiceFormData, type ServiceStatusType } from "./types";

interface CreateServiceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ServiceFormData;
  setFormData: (data: ServiceFormData) => void;
  onSubmit: () => void;
  trigger?: React.ReactNode;
}

function CreateServiceModal({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  trigger,
}: CreateServiceModalProps) {
  const defaultTrigger = (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Add Service
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Service</DialogTitle>
          <DialogDescription>
            Add a new service to your organization. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter service name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter service description"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Current Status</Label>
            <Select
              id="status"
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
              id="publiclyVisible"
              checked={formData.publiclyVisible}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  publiclyVisible: e.target.checked,
                })
              }
              className="rounded"
            />
            <Label htmlFor="publiclyVisible">Publicly Visible</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!formData.name.trim()}>
            Create Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateServiceModal; 
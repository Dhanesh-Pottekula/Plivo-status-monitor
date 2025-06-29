import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type IncidentInterface } from "./types";

interface DeleteIncidentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIncident: IncidentInterface | null;
  onConfirm: () => void;
}

function DeleteIncidentModal({
  isOpen,
  onOpenChange,
  selectedIncident,
  onConfirm,
}: DeleteIncidentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Incident</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{selectedIncident?.title}"? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete Incident
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteIncidentModal; 
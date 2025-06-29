import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface EmptyStateProps {
  onCreateService: () => void;
}

function EmptyState({ onCreateService }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">
            No services found
          </h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first service.
          </p>
          <Button onClick={onCreateService}>
            <Plus className="h-4 w-4 mr-2" />
            Create Service
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default EmptyState; 
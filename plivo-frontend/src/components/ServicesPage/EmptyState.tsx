import { Plus, Package } from "lucide-react";
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
    <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50">
      <CardContent className="flex flex-col items-center justify-center py-16 px-8">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No services found
          </h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Get started by creating your first service to begin managing your organization's services and incidents.
          </p>
          <Button 
            onClick={onCreateService}
            className="px-6 py-3 font-medium hover:shadow-md transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Service
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default EmptyState; 
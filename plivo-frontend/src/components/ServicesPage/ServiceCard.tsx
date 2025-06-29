import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import {
  SERVICE_STATUS_OPTIONS,
} from "@/_constants/Interfaces/ServicesInterface";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type ServiceInterface, type ServiceStatusType } from "./types";

interface ServiceCardProps {
  service: ServiceInterface;
  onEdit: (service: ServiceInterface) => void;
  onDelete: (service: ServiceInterface) => void;
}

function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  const getStatusBadgeVariant = (status: ServiceStatusType) => {
    switch (status) {
      case "operational":
        return "default";
      case "degraded_performance":
        return "secondary";
      case "partial_outage":
        return "destructive";
      case "major_outage":
        return "destructive";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight mb-2">{service.name}</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {service.description}
            </CardDescription>
          </div>
          <div className="flex-shrink-0 flex items-center">
            {service.publiclyVisible ? (
              <Eye className="h-4 w-4 text-green-600" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={getStatusBadgeVariant(service.currentStatus as ServiceStatusType)}>
            {
              SERVICE_STATUS_OPTIONS.find(
                (opt) => opt.value === service.currentStatus
              )?.label
            }
          </Badge>
        </div>

        <Separator />

        <div className="text-xs text-muted-foreground space-y-1">
          <div>Created: {formatDate(service.createdAt)}</div>
          <div>Updated: {formatDate(service.updatedAt)}</div>
        </div>

        <div className="flex space-x-2 mt-auto pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(service)}
            className="flex-1"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(service)}
            className="flex-1 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ServiceCard; 
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
import { useNavigate } from "react-router-dom";
import { appRoutes } from "@/config/appRoutes";
import { formatDate, getStatusBadgeVariant } from "@/_helpers/commonFunctions";

interface ServiceCardProps {
  service: ServiceInterface;
  onEdit: (service: ServiceInterface) => void;
  onDelete: (service: ServiceInterface) => void;
}

function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  const navigate = useNavigate();
 
  const onViewDetails = (service: ServiceInterface) => {
    navigate(appRoutes.service_details.replace(':service_id', service.id.toString()));
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 h-full flex flex-col border-0 shadow-sm">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold leading-tight mb-2 text-gray-900">{service.name}</CardTitle>
            <CardDescription className="text-sm leading-relaxed text-gray-600">
              {service.description}
            </CardDescription>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            {service.publiclyVisible ? (
              <Eye className="h-4 w-4 text-green-600" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-400" />
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(service)}
              className="h-7 px-2 hover:bg-gray-50 hover:border-gray-200 transition-colors"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <Badge variant={getStatusBadgeVariant(service.currentStatus as ServiceStatusType)} className="font-medium">
            {
              SERVICE_STATUS_OPTIONS.find(
                (opt) => opt.value === service.currentStatus
              )?.label
            }
          </Badge>
        </div>

        <Separator className="my-2" />

        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{formatDate(service.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span>Updated:</span>
            <span>{formatDate(service.updatedAt)}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-auto pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 hover:bg-blue-50 hover:border-blue-200 transition-colors" 
            onClick={() => onViewDetails(service)}
          >
            <Eye className="h-3 w-3 mr-1" />
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(service)}
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors"
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
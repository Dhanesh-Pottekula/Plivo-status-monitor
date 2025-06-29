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
    <Card className="group hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-200 shadow-sm hover:border-gray-300 bg-white">
      <CardHeader className="pb-4 flex-shrink-0 px-6 pt-6">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-semibold leading-tight mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
              {service.name}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed text-gray-600 line-clamp-2">
              {service.description}
            </CardDescription>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            {service.publiclyVisible ? (
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <Eye className="h-3 w-3" />
                <span className="text-xs font-medium">Public</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                <EyeOff className="h-3 w-3" />
                <span className="text-xs font-medium">Private</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(service)}
              className="h-8 w-8 p-0 hover:bg-gray-100 hover:text-blue-600 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-5 px-6 pb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <Badge variant={getStatusBadgeVariant(service.currentStatus as ServiceStatusType)} className="font-medium px-3 py-1">
            {
              SERVICE_STATUS_OPTIONS.find(
                (opt) => opt.value === service.currentStatus
              )?.label
            }
          </Badge>
        </div>

        <Separator className="my-2" />

        <div className="text-xs text-gray-500 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Created</span>
            <span className="text-gray-700">{formatDate(service.createdAt)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Updated</span>
            <span className="text-gray-700">{formatDate(service.updatedAt)}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-auto pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 font-medium" 
            onClick={() => onViewDetails(service)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(service)}
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-medium"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ServiceCard; 
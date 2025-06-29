import { type ServiceStatusType, type ServiceInterface } from "@/_constants/Interfaces/ServicesInterface";

export interface ServiceFormData {
  name: string;
  description: string;
  currentStatus: ServiceStatusType;
  publiclyVisible: boolean;
}

export type { ServiceInterface, ServiceStatusType }; 
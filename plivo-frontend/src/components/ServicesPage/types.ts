import { type ServiceStatusType, type ServiceInterface, type IncidentStatusType, type IncidentSeverityType, type IncidentInterface } from "@/_constants/Interfaces/ServicesInterface";

export interface ServiceFormData {
  name: string;
  description: string;
  currentStatus: ServiceStatusType;
  publiclyVisible: boolean;
}

export interface IncidentFormData {
  title: string;
  description: string;
  status: IncidentStatusType;
  severity: IncidentSeverityType;
}

export type { ServiceInterface, ServiceStatusType, IncidentInterface, IncidentStatusType, IncidentSeverityType }; 
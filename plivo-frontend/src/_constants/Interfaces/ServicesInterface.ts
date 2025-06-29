export interface ServiceStatus {
  value: string;
  label: string;
}

export type ServiceStatusType = 'operational' | 'degraded_performance' | 'partial_outage' | 'major_outage';

export const SERVICE_STATUS_OPTIONS: ServiceStatus[] = [
  { value: 'operational', label: 'Operational' },
  { value: 'degraded_performance', label: 'Degraded Performance' },
  { value: 'partial_outage', label: 'Partial Outage' },
  { value: 'major_outage', label: 'Major Outage' },
];

export interface ServiceInterface {
  id: number;
  organizationId: string;
  organization?: {
    id: string;
    name: string;
    domain?: string;
  };
  name: string;
  description: string;
  currentStatus: ServiceStatusType;
  publiclyVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentInterface {
  id: number;
  serviceId: number;
  serviceName?: string;
  title: string;
  description: string;
  status: IncidentStatusType;
  severity: IncidentSeverityType;
  createdBy: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type IncidentStatusType = 
  | "investigating"
  | "identified"
  | "monitoring"
  | "resolved";

export type IncidentSeverityType = 
  | "low"
  | "medium"
  | "high"
  | "critical";

export const INCIDENT_STATUS_OPTIONS = [
  { value: "investigating", label: "Investigating" },
  { value: "identified", label: "Identified" },
  { value: "monitoring", label: "Monitoring" },
  { value: "resolved", label: "Resolved" },
];

export const INCIDENT_SEVERITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];


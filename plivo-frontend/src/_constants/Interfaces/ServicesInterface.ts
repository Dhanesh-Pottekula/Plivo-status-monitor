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
  name: string;
  description: string;
  currentStatus: ServiceStatusType;
  publiclyVisible: boolean;
  createdAt: string;
  updatedAt: string;
}


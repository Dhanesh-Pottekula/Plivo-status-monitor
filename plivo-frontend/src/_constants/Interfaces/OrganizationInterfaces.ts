export interface OrganizationInterface {
  id: string;
  name: string;
  domain: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  user_count?: number;
  active_user_count?: number;
}

export interface OrganizationsResponse {
  organizations: OrganizationInterface[];
  success: boolean;
}

export interface OrganizationDetailsResponse {
  organization: OrganizationInterface;
  success: boolean;
} 
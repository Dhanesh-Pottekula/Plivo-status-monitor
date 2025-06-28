export enum UserRole {
  ADMIN = "admin",
  TEAM = "team",
  USER = "user",
}

export interface Organization {
  id: string;
  name: string;
  domain?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface UserInterface {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  role: UserRole;
  organization?: Organization;
  is_organization_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SignUpFormData {
  // Organization fields (for admin signup)
  organization_name?: string;
  organization_domain?: string;
  
  // User fields
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  role: UserRole;
  
  // For team members joining existing organization
  organization_id?: string;
  invite_code?: string;
}

export interface SignUpResponse {
  user: UserInterface;
  organization?: Organization;
  message: string;
  success: boolean;
}
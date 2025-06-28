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
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: UserRole;
  organization_name: string;
  organization_link: string;
}

export interface SignUpResponse {
  user: UserInterface;
  organization?: Organization;
  message: string;
  success: boolean;
}
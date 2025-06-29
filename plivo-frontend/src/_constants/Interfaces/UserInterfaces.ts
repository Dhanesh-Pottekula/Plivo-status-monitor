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
  full_name: string;
  phone?: string;
  has_access: boolean;
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
  username: string;
}

export interface SignUpFormData {
  full_name: string;
  username: string;
  password: string;
  confirm_password: string;
  role: UserRole;
  organization_name: string;
  organization_link: string;
  token?: string;
}

export interface SignUpResponse {
  user: UserInterface;
  organization?: Organization;
  message: string;
  success: boolean;
}


export interface InviteLinkInterface {
  message: string;
  success: boolean;
  invite_url: string;
  expires_at: string;
  invite_data: {
    id: string;
    username: string;
    role: UserRole;
    created_at: string;
    expires_at: string;
    }
}

export interface TeamMemberInterface {
  id: string;
  username: string;
  role: UserRole;
  is_expired: boolean;
  token: string;
  is_valid: boolean;
  used_by: {
    id: string;
    username: string;
    full_name: string;
    has_access: boolean;
  } | null;
  created_at: string;
  expires_at: string;
}
export interface TeamMemberResponse {
  invite_links: TeamMemberInterface[];
  message: string;
  success: boolean;
}
export const ROLES = {
  ADMIN: 'admin',
  RECRUITMENT_USER: 'recruitment_user', 
  CANDIDATE_USER: 'candidate_user',
} as const;

export const PERMISSIONS = {
  // Admin permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_COMPANIES: 'manage_companies',
  MANAGE_DEPARTMENTS: 'manage_departments',
  
  // Recruitment permissions
  VIEW_OPPORTUNITIES: 'view_opportunities',
  CREATE_OPPORTUNITIES: 'create_opportunities',
  EDIT_OPPORTUNITIES: 'edit_opportunities',
  DELETE_OPPORTUNITIES: 'delete_opportunities',
  MANAGE_APPLICATIONS: 'manage_applications',
  
  // Candidate permissions
  CREATE_PROFILE: 'create_profile',
  EDIT_PROFILE: 'edit_profile',
  VIEW_OWN_PROFILE: 'view_own_profile',
  APPLY_TO_OPPORTUNITIES: 'apply_to_opportunities',
  VIEW_OWN_APPLICATIONS: 'view_own_applications',
} as const;

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.MANAGE_COMPANIES,
    PERMISSIONS.MANAGE_DEPARTMENTS,
    PERMISSIONS.VIEW_OPPORTUNITIES,
    PERMISSIONS.CREATE_OPPORTUNITIES,
    PERMISSIONS.EDIT_OPPORTUNITIES,
    PERMISSIONS.DELETE_OPPORTUNITIES,
    PERMISSIONS.MANAGE_APPLICATIONS,
  ],
  [ROLES.RECRUITMENT_USER]: [
    PERMISSIONS.VIEW_OPPORTUNITIES,
    PERMISSIONS.CREATE_OPPORTUNITIES,
    PERMISSIONS.EDIT_OPPORTUNITIES,
    PERMISSIONS.MANAGE_APPLICATIONS,
  ],
  [ROLES.CANDIDATE_USER]: [
    PERMISSIONS.CREATE_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.APPLY_TO_OPPORTUNITIES,
    PERMISSIONS.VIEW_OWN_APPLICATIONS,
  ],
} as const;

// Type definitions
export type Role = typeof ROLES[keyof typeof ROLES];
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

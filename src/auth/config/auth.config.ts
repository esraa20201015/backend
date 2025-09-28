import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  // Global auth settings
  enableGlobalAuth: process.env.ENABLE_GLOBAL_AUTH === 'true' || true,
  defaultRoles: process.env.DEFAULT_ROLES?.split(',') || ['candidate_user'],
  
  // Role-based settings
  adminRoles: ['admin'],
  recruiterRoles: ['recruitment_user'],
  candidateRoles: ['candidate_user'],
  
  // Permission settings
  enablePermissions: true,
  enableScopedAccess: true,
  
  // Security settings
  passwordMinLength: 8,
  passwordRequireSpecialChars: true,
  maxLoginAttempts: 5,
  lockoutDuration: 15, // minutes
}));

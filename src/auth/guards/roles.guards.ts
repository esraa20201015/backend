/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    // If no roles or permissions required, allow access
    if (!requiredRoles && !requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    const user = request['user'];
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check roles
    if (requiredRoles && requiredRoles.length > 0) {
      if (!Array.isArray(user.roles) || user.roles.length === 0) {
        throw new ForbiddenException('User roles not found');
      }

      const hasRequiredRole = user.roles.some((role: string) =>
        requiredRoles.includes(role),
      );
      
      if (!hasRequiredRole) {
        throw new ForbiddenException(
          `Insufficient role. Required: ${requiredRoles.join(', ')}. User has: ${user.roles.join(', ')}`
        );
      }
    }

    // Check permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
      if (!Array.isArray(user.permissions) || user.permissions.length === 0) {
        throw new ForbiddenException('User permissions not found');
      }

      const hasRequiredPermission = requiredPermissions.some((permission: string) =>
        user.permissions.includes(permission),
      );
      
      if (!hasRequiredPermission) {
        throw new ForbiddenException(
          `Insufficient permission. Required: ${requiredPermissions.join(', ')}. User has: ${user.permissions.join(', ')}`
        );
      }
    }

    return true;
  }
}

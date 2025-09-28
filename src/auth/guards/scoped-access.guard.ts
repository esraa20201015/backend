import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ScopedAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request['user'];
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admin can access everything
    if (user.roles?.includes('admin')) {
      return true;
    }

    // Candidates see only their data
    if (user.roles?.includes('candidate_user')) {
      const userId = request.params?.userId || request.body?.userId;
      if (userId && parseInt(userId) !== user.userId) {
        throw new ForbiddenException('Candidates can only access their own data');
      }
    }

    // Recruiters see their company data
    if (user.roles?.includes('recruitment_user')) {
      const companyId = request.params?.companyId || request.body?.companyId;
      if (companyId && parseInt(companyId) !== user.companyId) {
        throw new ForbiddenException('Recruiters can only access their company data');
      }
    }

    return true;
  }
}

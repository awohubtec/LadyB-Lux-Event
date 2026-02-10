import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../../generated/prisma/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', ctx.getHandler());
    if (!roles) return true;

    const request = ctx.switchToHttp().getRequest();
    return roles.includes(request.user.role);
  }
}

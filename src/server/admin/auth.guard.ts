import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        return request.headers.cookie && request.headers.cookie.includes('admin-user-id');
    }
}

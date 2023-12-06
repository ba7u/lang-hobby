import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseGuard } from './guard';
import { Request } from 'express';

@Injectable()
export class SupabaseUserGuard extends SupabaseGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isJWTAuthed = await super.canActivate(context);
        const request: Request = context.switchToHttp().getRequest();
        const hasValidUserId = request.header('user-id') !== undefined;
        if (!hasValidUserId) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        return !!isJWTAuthed;
    }
}

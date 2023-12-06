import { ArgumentsHost, ExceptionFilter, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class NotAuthorizedExceptionFilter implements ExceptionFilter {
    catch(exception, host: ArgumentsHost) {
        const res: Response = host.switchToHttp().getResponse();
        const req: Request = host.switchToHttp().getRequest();
        const next = host.switchToHttp().getNext();
        if (exception instanceof UnauthorizedException) {
            return res.redirect(`/login?redirect=${req.url}`);
        }

        return next(exception);
    }
}

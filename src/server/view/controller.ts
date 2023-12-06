import { Controller, Get, Res, Req, UseGuards, Next, UseFilters } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { ViewService } from './service';
import { SupabaseGuard } from '../supabase/guard';
import { NotAuthorizedExceptionFilter } from '../helpers/not-authorized.filter';

@Controller()
export class ViewController {
    constructor(private viewService: ViewService) {}

    @Get('/app')
    @UseGuards(SupabaseGuard)
    @UseFilters(NotAuthorizedExceptionFilter)
    privateGateway(@Req() req: Request, @Res() res: Response) {
        const handle = this.viewService.getNextServer().getRequestHandler();
        handle(req, res);
    }

    @Get('*')
    publicGateway(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        if (req.url.startsWith('/api')) {
            return next();
        }
        const handle = this.viewService.getNextServer().getRequestHandler();
        handle(req, res);
    }
}

import { Controller, HttpException, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { SupabaseAdminService } from '../supabase/admin.service';
import { AdminAuthGuard } from './auth.guard';

@Controller('api/admin')
export class AdminController {
    private logger = new Logger(AdminController.name);

    constructor(private readonly supabaseAdminSrvice: SupabaseAdminService) {}

    @Post('sign-in')
    async authoriseAdmin(@Res() res: Response) {
        const response = await this.supabaseAdminSrvice.authAdmin();
        if (response.error) {
            this.logger.error(response.error.status, response.error);
            throw new HttpException('An error occurred', response.error.status);
        }
        const { access_token } = response.data.session;
        res.cookie('admin-user-id', response.data.user.id, { httpOnly: true, sameSite: 'strict' });
        res.setHeader('Authorization', `Bearer ${access_token}`).end();
    }

    @Post('sign-out')
    @UseGuards(AdminAuthGuard)
    async signOutAdmin(@Res() res: Response) {
        await this.supabaseAdminSrvice.signOut();
        res.clearCookie('admin-user-id').end();
    }
}

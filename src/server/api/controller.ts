import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { SupabaseAdminService } from '../supabase/admin.service';
import { SupabaseClientService } from '../supabase/client.service';
import { SupabaseGuard } from '../supabase/guard';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { LanguageLevelEnum } from '../@types/language-level.enum';
import { SessionService } from '../session/service';

class AuthBody {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    occupation: string;

    @IsNotEmpty()
    level: LanguageLevelEnum;
}

@Controller('api')
export class ApiController {
    private logger = new Logger(ApiController.name);

    constructor(
        private readonly supabaseClientService: SupabaseClientService,
        private readonly supabaseAdminService: SupabaseAdminService,
        private readonly sessionService: SessionService
    ) {}

    @Get('healthcheck')
    healthCheck(@Res() res: Response) {
        res.json({ ok: true });
    }

    @Get('/auth/healthcheck')
    @UseGuards(SupabaseGuard)
    authHealthCheck(@Res() res: Response) {
        res.json({ ok: true });
    }

    @Post('auth')
    async handleUserAuth(@Body() { email, ...metadata }: AuthBody, @Res() res: Response) {
        let signInUserResponse = await this.authUserByEmail(email);
        if (signInUserResponse.error) {
            if (signInUserResponse.error.status === HttpStatus.BAD_REQUEST) {
                const createUserResponse = await this.supabaseAdminService.createNotVerifiedUser(email, metadata);
                if (createUserResponse.error) {
                    this.logger.error(createUserResponse.error.status, createUserResponse.error);
                    throw new HttpException('An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
                }
                signInUserResponse = await this.authUserByEmail(email);
            } else {
                this.logger.error(signInUserResponse.error.status, signInUserResponse.error);
                throw new HttpException('An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        const {
            session: { access_token },
            user,
        } = signInUserResponse.data;
        this.logger.log(`User ${email} signed in, access_token ${access_token}, user_id ${user.id}`);
        res.setHeader('user-id', user.id);
        this.sessionService.addToSession(`user:${user.id}`, { user });
        res.setHeader('Authorization', `Bearer ${access_token}`).end();
    }

    async authUserByEmail(email: string) {
        return this.supabaseClientService.signInUserWithEmail(email);
    }
}

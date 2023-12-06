import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ExtractJwt } from 'passport-jwt';
import { DatabaseInterface } from '../@types/supabase.db';
import { SupabaseAdminService } from './admin.service';

@Injectable({ scope: Scope.REQUEST })
export class SupabaseClientService {
    private logger = new Logger(SupabaseClientService.name);
    private instance: SupabaseClient;

    constructor(@Inject(REQUEST) private readonly request: Request) {}

    getClient() {
        if (this.instance) {
            return this.instance;
        }

        this.instance = createClient<DatabaseInterface>(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLIC_KEY, {
            auth: {
                autoRefreshToken: true,
                persistSession: false,
            },
            global: {
                headers: {
                    Authorization: `Bearer ${ExtractJwt.fromAuthHeaderAsBearerToken()(this.request)}`,
                },
            },
        });
        this.logger.log('Supabase client created');
        return this.instance;
    }

    signInUserWithEmail(email: string) {
        return this.getClient().auth.signInWithPassword({ email, password: SupabaseAdminService.NotVerifiedUserPW });
    }
}

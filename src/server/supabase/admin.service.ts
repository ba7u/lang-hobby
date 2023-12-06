import { Injectable, Logger, Scope } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DatabaseInterface } from '../@types/supabase.db';
import { UserStageEnum } from '../@types/user-stage.enum';

// @Injectable({ scope: Scope.REQUEST })
@Injectable({ scope: Scope.DEFAULT })
export class SupabaseAdminService {
    static NotVerifiedUserPW = process.env.APP_NOT_VERIFIED_USER_PW;

    private logger = new Logger(SupabaseAdminService.name);
    private instance: SupabaseClient;

    getClient() {
        return this.instance;
    }

    initClient() {
        this.instance = createClient<DatabaseInterface>(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );
        this.logger.log('Supabase admin client created');
    }

    async createNotVerifiedUser(email: string, metadata: Record<string, string>) {
        return this.getClient().auth.admin.createUser({
            email,
            password: SupabaseAdminService.NotVerifiedUserPW,
            email_confirm: true,
            user_metadata: {
                ...metadata,
                stage: UserStageEnum.NOTVERIFIED,
            },
        });
    }

    async authAdmin() {
        return this.getClient().auth.signInWithPassword({
            email: process.env.APP_ADMIN_EMAIL,
            password: process.env.APP_ADMIN_PW,
        });
    }

    async signOut() {
        return this.getClient().auth.signOut();
    }

    async insertRowToTable<T>(tableName: string, row: T) {
        return this.getClient().from(tableName).insert(row);
    }

    async insertBulkRowsToTable<T>(tableName: string, rows: T[], iterator?: <D extends T>(data: D) => D) {
        for (const row of rows) {
            const { error } = await this.insertRowToTable(tableName, iterator ? iterator(row) : row);
            if (error) {
                this.logger.warn(error);
            }
        }
    }
}

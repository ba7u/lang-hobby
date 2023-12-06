import { Module } from '@nestjs/common';
import { SupabaseAdminService } from './admin.service';
import { SupabaseStrategy } from './strategy';
import { SupabaseGuard } from './guard';
import { SupabaseClientService } from './client.service';

@Module({
    providers: [SupabaseAdminService, SupabaseClientService, SupabaseStrategy, SupabaseGuard],
    exports: [SupabaseAdminService, SupabaseClientService, SupabaseGuard],
})
export class SupabaseModule {
    constructor(readonly supabaseAdminService: SupabaseAdminService) {
        this.supabaseAdminService.initClient();
    }
}

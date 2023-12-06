import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiService } from './service';
import { ApiController } from './controller';
import { SupabaseModule } from '../supabase/module';
import { SessionModule } from '../session/module';

@Module({
    imports: [
        HttpModule.register({
            timeout: parseInt(process.env.DEFAULT_API_TIMEOUT_DURATION, 10),
        }),
        SupabaseModule,
        SessionModule,
    ],
    controllers: [ApiController],
    providers: [ApiService],
})
export class ApiModule {}

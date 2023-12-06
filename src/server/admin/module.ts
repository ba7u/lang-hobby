import { Module } from '@nestjs/common';
import { AdminController } from './controller';
import { SupabaseModule } from '../supabase/module';
import { AdminPopulateModule } from './populate/module';

@Module({
    imports: [AdminPopulateModule, SupabaseModule],
    controllers: [AdminController],
})
export class AdminModule {}

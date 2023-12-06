import { Module } from '@nestjs/common';
import { AdminPopulateConsumer } from './consumer';
import { SupabaseModule } from 'src/server/supabase/module';
import { AdminPopulateController } from './controller';
import { AdminPopulateFactoryService } from './factory.service';
import { PopulateBullModule } from './bull-module';

@Module({
    imports: [PopulateBullModule, SupabaseModule],
    providers: [AdminPopulateConsumer, AdminPopulateFactoryService],
    controllers: [AdminPopulateController],
})
export class AdminPopulateModule {}

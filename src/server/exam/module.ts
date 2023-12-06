import { Module } from '@nestjs/common';
import { ExamFactoryService } from './factory.service';
import { ExamController } from './controller';
import { PickWordService } from './pick-word.service';
import { SupabaseModule } from '../supabase/module';
import { SessionModule } from '../session/module';
import { PopulateBullModule } from '../admin/populate/bull-module';

@Module({
    imports: [PopulateBullModule, SessionModule, SupabaseModule],
    controllers: [ExamController],
    providers: [ExamFactoryService, PickWordService],
    exports: [ExamFactoryService],
})
export class ExamModule {}

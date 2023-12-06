import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ViewModule } from './view/module';
import { BullModule } from '@nestjs/bull';
import { RequestLoggerMiddleware } from './helpers/request.middleware';
import { SupabaseModule } from './supabase/module';
import { PassportModule } from '@nestjs/passport';
import { ApiModule } from './api/module';
import { AdminModule } from './admin/module';
import { ExamModule } from './exam/module';

@Module({
    imports: [
        BullModule.forRootAsync({
            useFactory: () => ({
                redis: {
                    host: process.env.REDIS_HOST,
                    port: parseInt(process.env.REDIS_PORT, 10),
                },
            }),
        }),
        ViewModule,
        ApiModule,
        AdminModule,
        PassportModule,
        SupabaseModule,
        ExamModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    }
}

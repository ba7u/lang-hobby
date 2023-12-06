import { Module } from '@nestjs/common';
import { SessionRedisModule } from './redis.module';
import { SessionService } from './service';

@Module({
    imports: [SessionRedisModule],
    providers: [SessionService],
    exports: [SessionRedisModule, SessionService],
})
export class SessionModule {}

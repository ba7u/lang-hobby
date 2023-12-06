import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

export const SessionRedisModule = CacheModule.registerAsync({
    useFactory: async () => ({
        isGlobal: true,
        store: await redisStore({
            socket: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT, 10),
            },
        }),
    }),
});

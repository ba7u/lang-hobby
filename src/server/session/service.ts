import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class SessionService {
    constructor(@Inject(CACHE_MANAGER) private readonly redisService: Cache) {}

    async setSession<T>(key: string, value: T): Promise<void> {
        return this.redisService.set(key, value);
    }

    async getSession<T>(key: string): Promise<T> {
        const data = await this.redisService.get<string>(key);
        return data as T;
    }

    async addToSession<T>(key: string, data: T): Promise<void> {
        const session = (await this.getSession(key)) || {};
        return this.setSession(key, Object.assign(session, data));
    }

    async deleteSession(key: string): Promise<void> {
        return this.redisService.del(key);
    }
}

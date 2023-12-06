import { Injectable, OnModuleInit } from '@nestjs/common';
import next from 'next';
import { NextServer } from 'next/dist/server/next';
import { getProcessOption } from 'src/helpers/get-process-option';
import { isEnvDev } from 'src/helpers/is-env-dev';

const isEnvProd = !isEnvDev();

@Injectable()
export class ViewCommonService implements OnModuleInit {
    /**
     * next server
     */
    private server: NextServer;

    /**
     * next - init hook
     */
    async onModuleInit(): Promise<void> {
        if (!getProcessOption('ignore-client-dev') || !isEnvProd) {
            try {
                this.server = next({
                    dev: true,
                    dir: './src/client',
                });
                await this.server.prepare();
            } catch (error) {
                console.error(error);
            }
        }
    }

    getNextServer = (): NextServer => this.server;
}

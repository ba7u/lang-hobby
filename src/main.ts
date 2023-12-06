import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './server/app-module';
import { Transport } from '@nestjs/microservices';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import { ValidationPipe } from '@nestjs/common';

(async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger({
            transports: [
                // let's log errors into its own file
                new transports.File({
                    filename: `logs/error.log`,
                    level: 'error',
                    format: format.combine(format.timestamp(), format.json()),
                }),
                // logging all level
                new transports.File({
                    filename: `logs/combined.log`,
                    format: format.combine(format.timestamp(), format.json()),
                }),
                // we also want to see logs in our console
                new transports.Console({
                    format: format.combine(
                        format.cli(),
                        format.splat(),
                        format.timestamp(),
                        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
                    ),
                }),
            ],
        }),
    });
    app.useGlobalPipes(new ValidationPipe());
    app.connectMicroservice({
        transport: Transport.REDIS,
        options: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT, 10),
        },
    });
    await app.startAllMicroservices();
    await app.listen(process.env.PORT);

    app.use(cookieParser.default());
})();

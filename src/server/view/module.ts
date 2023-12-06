import { Module } from '@nestjs/common';
import { ViewController } from './controller';
import { ViewService } from './service';

@Module({
    controllers: [ViewController],
    providers: [ViewService],
})
export class ViewModule {}

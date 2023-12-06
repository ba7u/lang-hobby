import { BullModule } from '@nestjs/bull';

export const PopulateBullModule = BullModule.registerQueueAsync({ name: 'populate' });

import { Body, Controller, HttpStatus, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../auth.guard';
import { Response } from 'express';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { LanguageLevelEnum } from 'src/server/@types/language-level.enum';

class PopulateBody {
    level: LanguageLevelEnum;
}

@Controller('api/admin')
export class AdminPopulateController {
    private logger = new Logger(AdminPopulateController.name);
    constructor(@InjectQueue('populate') readonly populateQueue: Queue) {}

    @Post('populate')
    @UseGuards(AdminAuthGuard)
    public async getWords(@Body() body: PopulateBody, @Res() res: Response): Promise<void> {
        try {
            const job = await this.populateQueue.add('populate-initial', body, { attempts: 1, removeOnComplete: true });
            res.status(HttpStatus.OK).json({ ok: true, message: `Job ${job.id} created` });
        } catch (err) {
            this.logger.error(err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, error: err });
        }
    }
}

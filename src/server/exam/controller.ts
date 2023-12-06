import { Controller, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { PickWordService } from './pick-word.service';
import { SupabaseUserGuard } from '../supabase/user.guard';
import { SessionService } from '../session/service';
import { UserSessionInterface } from '../session/user-session.interface';
// import { v4 as uuidv4 } from 'uuid';
import { StructureTypeEnum } from '../@types/structure-type.enum';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Controller('api/exam')
@UseGuards(SupabaseUserGuard)
export class ExamController {
    constructor(
        private readonly pickWordService: PickWordService,
        private readonly sessionService: SessionService,
        @InjectQueue('populate') readonly populateQueue: Queue
    ) {}

    @Post('generate')
    async generateExam(@Res() res: Response, @Req() req: Request) {
        const userId = req.header('user-id');
        const session: UserSessionInterface = await this.sessionService.getSession(`user:${userId}`);
        if (!session) {
            throw new HttpException('NotAuthorized', HttpStatus.UNAUTHORIZED);
        }

        const { level } = session.user.user_metadata;
        const structures = await this.pickWordService.getStructuresForLevel(level);

        const [phrasalVerbs] = structures.reduce(
            (acc, structure) => {
                if (structure.type === StructureTypeEnum.PHRASAL_VERB) {
                    acc[0].push(structure.eng);
                } else {
                    acc[1].push(structure.eng);
                }
                return acc;
            },
            [[], []]
        );
        const generateDetailedJob = await this.populateQueue.add('populate-detailed', {
            level,
            structures: phrasalVerbs,
        });
        await generateDetailedJob.finished();
        res.send({ ok: true });
    }
}

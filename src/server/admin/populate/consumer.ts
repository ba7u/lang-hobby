import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MeaningResponseInterface } from '../../@types/meaning.interface';
import { Logger } from '@nestjs/common';
import uniqBy from 'lodash/uniqBy';
import { SupabaseAdminService } from 'src/server/supabase/admin.service';
import { AdminPopulateFactoryService } from './factory.service';
import { LanguageLevelEnum } from 'src/server/@types/language-level.enum';
import { StructureTypeEnum } from 'src/server/@types/structure-type.enum';
import { TableEnum } from 'src/server/@types/table.enum';
// import PopulateJSON from '../../mocks/populate-response.json';

@Processor('populate')
export class AdminPopulateConsumer {
    static DEFAULT_STRUCTURE_TYPES_FOR_INITIAL = [StructureTypeEnum.WORD, StructureTypeEnum.PHRASAL_VERB];
    static DEFAULT_INITIAL_MAX_COUNT = 50;

    private logger = new Logger(AdminPopulateConsumer.name);

    constructor(
        private readonly supabaseAdminService: SupabaseAdminService,
        private readonly populateFactoryService: AdminPopulateFactoryService
    ) {}

    @Process({
        name: 'populate-initial',
        concurrency: 15,
    })
    async populateWords(job: Job<{ level: LanguageLevelEnum }>) {
        for (const structureType of AdminPopulateConsumer.DEFAULT_STRUCTURE_TYPES_FOR_INITIAL) {
            this.logger.log(
                `[populate] Start processing job. level: ${job.data.level} structureType: ${structureType}`
            );
            const existingWordsForLevel = await this.supabaseAdminService
                .getClient()
                .from(TableEnum.ALL_MEANINGS)
                .select('eng')
                .eq('level', job.data.level);
            if (existingWordsForLevel.error) {
                this.logger.warn(existingWordsForLevel.error);
            }
            const excludeSet = new Set<string>(existingWordsForLevel.data.map((word) => word.eng));
            try {
                const generateStructure = this.populateFactoryService.populateInitialStructure(structureType);
                this.logger.log('[populate] Start generating structure');
                const response = await generateStructure(
                    job.data.level,
                    AdminPopulateConsumer.DEFAULT_INITIAL_MAX_COUNT,
                    excludeSet
                );
                this.logger.log('[populate] End generating structure');
                if (!response.ok) {
                    this.logger.warn(
                        `[populate] Error while processing. level: ${job.data.level} structureType: ${structureType}`
                    );
                    return [];
                }
                const res = this.parseResponse(response.message);
                res.forEach(this.addWordToExcludeList(excludeSet));
                const uniqWords: MeaningResponseInterface[] = uniqBy(res.flat(), (word) => word.eng);
                try {
                    await this.supabaseAdminService.insertBulkRowsToTable(
                        TableEnum.MEANING,
                        uniqWords.map((word) => ({
                            eng: word.eng,
                            tr: word.tr,
                            type: word.type,
                            definition_en: word.definitions.eng,
                            category: word.category,
                            level: job.data.level,
                            definition_tr: word.definitions.tr,
                        }))
                    );
                    this.logger.log(`[populate] Inserted ${uniqWords.length} meanings to table ${TableEnum.MEANING}`);
                } catch (err) {
                    this.logger.error(err);
                    return [];
                }
            } catch (err) {
                this.logger.error(err);
                return [];
            } finally {
                this.logger.log(
                    `[populate] End processing job. level: ${job.data.level} structureType: ${structureType}`
                );
            }
        }
    }

    @Process({
        name: 'populate-detailed',
        concurrency: 10,
    })
    async populatePhrasalVerbs(job: Job<{ level: LanguageLevelEnum; structures: string[] }>) {
        try {
            const generateDetailed = this.populateFactoryService.populateDetailedStructure();
            this.logger.log('[populate-detailed] Start generating structure');
            for (const structure of job.data.structures) {
                this.logger.log(
                    `[populate-detailed] Start processing job. level: ${job.data.level} structure: ${structure}`
                );
                const response = await generateDetailed(job.data.level, structure);
                if (!response.ok) {
                    this.logger.warn('[populate-detailed] Error while processing.');
                    return [];
                }
                const res = this.parseResponse(response.message);
                console.info(res);
            }
        } catch (err) {
            this.logger.error(err);
        }
    }

    private parseResponse(response: string): MeaningResponseInterface[] {
        try {
            return JSON.parse(response.split('\n').join(' ')).response;
        } catch (err) {
            this.logger.warn(response);
            this.logger.warn('JSON parse error ', err);
            return [];
        }
    }

    private addWordToExcludeList = (set: Set<string>) => (word: MeaningResponseInterface) => set.add(word.eng);

    // private insertMockData() {
    //     return this.supabaseAdminService.insertBulkRowsToTable(
    //         TableEnum.MEANING,
    //         PopulateJSON.response.map((word) => ({
    //             eng: word.eng,
    //             tr: word.tr,
    //             type: word.type,
    //             definition_en: word.definitions.eng,
    //             category: word.category,
    //             level: 'A1',
    //             definition_tr: word.definitions.tr,
    //         }))
    //     );
    // }

    @OnQueueCompleted()
    onComplete(job: Job) {
        this.logger.log(`Job ${job.id} completed for ${job.data.level}.`);
    }
}

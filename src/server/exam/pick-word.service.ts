import { Injectable, Logger } from '@nestjs/common';
import { SupabaseClientService } from '../supabase/client.service';
import { TableEnum } from '../@types/table.enum';
import { LanguageLevelEnum } from '../@types/language-level.enum';

@Injectable()
export class PickWordService {
    private logger = new Logger(PickWordService.name);
    constructor(private supabaseClientService: SupabaseClientService) {}

    async getStructuresForLevel(level: LanguageLevelEnum) {
        const randomWords = await this.supabaseClientService
            .getClient()
            .from(TableEnum.RANDOM_MEANINGS)
            .select('eng, tr, type, definition_tr, definition_en')
            .eq('level', level)
            .limit(20);
        if (randomWords.error) {
            this.logger.warn(randomWords.error);
            return [];
        }
        return randomWords.data;
    }
}

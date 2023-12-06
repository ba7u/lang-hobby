import { Injectable } from '@nestjs/common';
import { LanguageLevelEnum } from 'src/server/@types/language-level.enum';
import { StructureTypeEnum } from 'src/server/@types/structure-type.enum';
import { AdminPopulateStructure } from './structure';
import { AdminPopulateDetailedStructure } from './detailed-structure';

@Injectable()
export class AdminPopulateFactoryService {
    private static readonly verbose = false;

    populateInitialStructure(type: StructureTypeEnum) {
        const structureInstance = new AdminPopulateStructure(type);
        const getPrompt = structureInstance.getRawPrompt();
        return (level: LanguageLevelEnum, count: number, excludeSet: Set<string>) => {
            const structurePrompt = getPrompt(level, count, excludeSet);
            return structureInstance.sendStructurePrompt(structurePrompt, AdminPopulateFactoryService.verbose);
        };
    }

    populateDetailedStructure() {
        const structureInstance = new AdminPopulateDetailedStructure();
        const getPrompt = structureInstance.getRawPrompt();
        return (level: LanguageLevelEnum, phrasalVerb: string) => {
            const structurePrompt = getPrompt(level, phrasalVerb);
            return structureInstance.sendStructurePrompt(structurePrompt, AdminPopulateFactoryService.verbose);
        };
    }
}

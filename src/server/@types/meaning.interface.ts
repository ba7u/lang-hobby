import { StructureTypeEnum } from 'src/server/@types/structure-type.enum';

export interface MeaningResponseInterface {
    eng: string;
    tr: string;
    category: string;
    type: StructureTypeEnum;
    definitions: {
        eng: string;
        tr: string;
    };
}

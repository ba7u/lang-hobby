import { OpenAiService } from '../../open-ai/service';
import { LanguageLevelEnum } from 'src/server/@types/language-level.enum';
import { StructureTypeEnum } from 'src/server/@types/structure-type.enum';

export class AdminPopulateStructure extends OpenAiService {
    static INITIAL_PROMPT = `
    You are an English teacher who tries to improve student's vocabulary knowledge. Your students are all at the {ENG_LEVEL} level.
    The response must be with this structure:
    {"response": [{"eng": A,"tr": B,"type": C, "definitions": {"eng":D, "tr":E}, "category": G}]}
    A = English {STRUCTURE_TYPE}.
    B = Turkish translation.
    C = type of {STRUCTURE_TYPE}. It can be a noun, verb, adjective, or adverb.
    D = An English definition sentence of the {STRUCTURE_TYPE}.
    E = A Turkish definition sentence of the {STRUCTURE_TYPE}.
    G = Word category.
    Your answer must contain only one JSON. 
    In the listing, {STRUCTURE_TYPE}s with the same meaning in Turkish should never be repeated.
    I'll ask you to list {STRUCTURE_TYPE}s in JSON, all in lowercase. List {COUNT} {STRUCTURE_TYPE}s.
    `;

    private structureType: StructureTypeEnum;

    constructor(type: StructureTypeEnum) {
        super();
        this.structureType = type;
    }

    getRawPrompt() {
        const structurePrompt = AdminPopulateStructure.INITIAL_PROMPT.replace(/{STRUCTURE_TYPE}/g, this.structureType);
        return this.getPromptWithVariables(structurePrompt);
    }

    private getPromptWithVariables(prompt: string) {
        return (level: LanguageLevelEnum, count: number, excludeSet: Set<string>) => {
            const promptWithVariables = prompt.replace('{ENG_LEVEL}', level).replace('{COUNT}', count.toString());
            const prompts = [promptWithVariables];
            if (excludeSet.size) {
                prompts.push('Exclude these words: ' + Array.from(excludeSet).join(', ') + '.');
            }
            return prompts.join('');
        };
    }

    sendStructurePrompt(prompt: string, verbose: boolean) {
        return super.sendPrompt(prompt, verbose);
    }
}

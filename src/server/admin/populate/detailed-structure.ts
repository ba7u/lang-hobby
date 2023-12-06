import { OpenAiService } from '../../open-ai/service';
import { LanguageLevelEnum } from 'src/server/@types/language-level.enum';
import { StructureTypeEnum } from 'src/server/@types/structure-type.enum';

export class AdminPopulateDetailedStructure extends OpenAiService {
    static INITIAL_PROMPT = `
    You are an English teacher who tries to improve student's vocabulary knowledge. Your students are all at the {ENG_LEVEL} level.
    The response must be with this structure:
    {"response": [{tr: "Turkish meaning", "definition_tr": "Definition sentence in Turkish", "definition_en": "Definition sentence in English"}]}
    Your answer must contain only one JSON. 
    In the listing, ${StructureTypeEnum.PHRASAL_VERB}s with the same meaning in Turkish should never be repeated.
    I'll ask you to share at least 5 meanings corresponding to the variables for the given ${StructureTypeEnum.PHRASAL_VERB}.
    ${StructureTypeEnum.PHRASAL_VERB}: {PHRASAL_VERB}.
    `;

    getRawPrompt() {
        return this.getPromptWithVariables(AdminPopulateDetailedStructure.INITIAL_PROMPT);
    }

    private getPromptWithVariables(prompt: string) {
        return (level: LanguageLevelEnum, phrasalVerb: string) => {
            const promptWithVariables = prompt.replace('{ENG_LEVEL}', level).replace('{PHRASAL_VERB}', phrasalVerb);
            return promptWithVariables;
        };
    }

    sendStructurePrompt(prompt: string, verbose = false) {
        return super.sendPrompt(prompt, verbose);
    }
}

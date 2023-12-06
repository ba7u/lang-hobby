import { Injectable } from '@nestjs/common';
import { OpenAiService } from '../../open-ai/service';
import { LanguageLevelEnum } from 'src/server/@types/language-level.enum';

@Injectable()
export class AdminPopulateWordService extends OpenAiService {
    static MAX_LENGTH = 20;
    static INITIAL_PROMPT = `
    You are an English teacher who tries to improve student's vocabulary knowledge. Your students are all at the {ENG_LEVEL} level.
    The response must be with this structure:
    {"response": [{"eng": A,"tr": B,"type": C, "definitions": {"eng":D, "tr":E}, "category": G}]}
    A = English word.
    B = Turkish translation.
    C = type of word. It can be a noun, verb, adjective, or adverb.
    D = An English definition sentence of the word.
    E = A Turkish definition sentence of the word.
    G = Word category.
    Your answer must contain only one JSON. 
    In the listing, words with the same meaning in Turkish should never be repeated.
    I'll ask you to list words in JSON, all in lowercase. List {COUNT} words.
    `.trim();

    private getPrompt(level: LanguageLevelEnum, count: number, excludeSet: Set<string>) {
        const promptWithVariables = AdminPopulateWordService.INITIAL_PROMPT.replace('{ENG_LEVEL}', level).replace(
            '{COUNT}',
            count.toString()
        );
        const prompts = [promptWithVariables];
        if (excludeSet.size) {
            prompts.push(' Exclude these words: ' + Array.from(excludeSet).join(',') + '.');
        }
        return prompts.join('');
    }

    sendPromptWithExcludeList(level: LanguageLevelEnum, count: number, excludeSet: Set<string>) {
        const prompt = this.getPrompt(level, count, excludeSet);
        return super.sendPrompt(prompt);
    }
}

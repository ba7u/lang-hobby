import { Logger } from '@nestjs/common';
import OpenAI from 'openai';

export class OpenAiService {
    private static readonly organization = 'org-87Ys55lJGKxacadYilbfUFQY';
    static readonly modelName = ['gpt-4-0613', 'gpt-3.5-turbo'][1];
    protected logger = new Logger(OpenAiService.name);

    private readonly openAiInstance = new OpenAI({
        organization: OpenAiService.organization,
        apiKey: process.env.OPENAI_API_KEY,
    });

    protected async sendPrompt(prompt: string, verbose = false) {
        try {
            const response = await this.openAiInstance.chat.completions.create({
                model: OpenAiService.modelName,
                messages: [{ role: 'user', content: prompt }],
            });
            if (verbose) {
                this.logger.log(prompt);
            }
            const [firstResponse] = response.choices;
            const { content } = firstResponse.message;
            if (verbose) {
                this.logger.log(content);
            }
            return { ok: true, message: content };
        } catch (err) {
            this.logger.warn(err);
            return { ok: false, errorCode: err.code };
        }
    }
}

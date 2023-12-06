import { LanguageLevelEnum } from '../@types/language-level.enum';

export interface UserSessionInterface {
    user: { id: string; user_metadata: { email: string; occupation: string; level: LanguageLevelEnum } };
}

import { Injectable } from '@nestjs/common';
import { ExamType } from './type.enum';
import { ExamMatchMeanings } from './match-meanings';
import { ExamSentenceFormation } from './sentence-formation';
import { ExamWordCompletion } from './word-completion';

@Injectable()
export class ExamFactoryService {
    generateExam(type: ExamType) {
        switch (type) {
            case ExamType.MatchMeanings:
                return new ExamMatchMeanings();
            case ExamType.SentenceFormation:
                return new ExamSentenceFormation();
            case ExamType.WordCompletion:
                return new ExamWordCompletion();
        }
    }
}

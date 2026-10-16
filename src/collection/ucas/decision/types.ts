export enum Kind {
    SELECTION = 'selection',
}

export enum QuestionType {
    CHOICE = 'choice',
}

export enum SignalType {
    DECIDE = 'decision.decide',
    DECIDED = 'decision.decided',
    ERROR = 'decision.error',
}

export enum DataType {
    REQUEST = 'Request',
    RESULT = 'Result',
    ERROR = 'Error',
}

export type {
    Body,
    Configuration,
    Item,
    Request,
    Result,
    Failure,
    Answers,
    Metadata,
    ValidationContext,
} from './schema.js';

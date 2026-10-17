export enum Kind {
    CONSTRUCTION = 'construction',
}

export enum QuestionType {
    CHOICE = 'choice',
}

export enum RequirementState {
    REQUIRED = 'REQUIRED',
    NOT_REQUIRED = 'NOT_REQUIRED',
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
    ConstructionResult,
    ConstructionRequest,
    DecisionPayload,
    Failure,
    Metadata,
    ValidationContext,
} from './schema.js';

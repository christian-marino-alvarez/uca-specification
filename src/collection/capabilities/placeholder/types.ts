export enum SignalType {
    GENERATE = 'placeholder.generate',
    GENERATED = 'placeholder.generated',
    ERROR = 'placeholder.error',
}

export enum DataType {
    REQUEST = 'Request',
    RESULT = 'Result',
    ERROR = 'Error',
}

export type {
    Body,
    Dimensions,
    ErrorResult,
    Request,
    Result,
    Shape,
} from './schema.js';

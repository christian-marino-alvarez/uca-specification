export enum Kind {
    WEB = 'web',
    LOGIC = 'logic',
}

export enum SignalType {
    LIST = 'catalog.list',
    LISTED = 'catalog.listed',
    ERROR = 'catalog.error',
}

export enum DataType {
    REQUEST = 'Request',
    RESULT = 'Result',
    ERROR = 'Error',
}

export type {
    Body,
    Entry,
    Failure,
    Request,
    Result,
} from './schema.js';

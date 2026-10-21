export enum SignalType {
    SHOW = 'skeleton.show',
    REMOVE = 'skeleton.remove',
    SHOWN = 'skeleton.shown',
    REMOVED = 'skeleton.removed',
    ERROR = 'skeleton.error',
}

export enum DataType {
    BODY = 'Body',
    SHOW_PAYLOAD = 'ShowPayload',
    REMOVE_PAYLOAD = 'RemovePayload',
    SHOWN_RESULT = 'ShownResult',
    REMOVED_RESULT = 'RemovedResult',
    ERROR_RESULT = 'ErrorResult',
    UNKNOWN = 'unknown',
}

export type {
    Body,
    ErrorResult,
    RemovePayload,
    RemovedResult,
    ShowPayload,
    ShownResult,
} from './schema.js';

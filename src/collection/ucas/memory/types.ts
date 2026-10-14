export { type Body, type MediaRange, bodySchema, mediaRangeSchema } from './schema.js';

export enum SignalType {
    SAVE = 'memory.save',
    GET = 'memory.get',
    REMOVE = 'memory.remove',
    CLEAR = 'memory.clear',
    SAVED = 'memory.saved',
    RETRIEVED = 'memory.retrieved',
    REMOVED = 'memory.removed',
    CLEARED = 'memory.cleared',
    ERROR = 'memory.error',
}

export enum DataType {
    BODY = 'Body',
    SAVE_PAYLOAD = 'SavePayload',
    GET_PAYLOAD = 'GetPayload',
    REMOVE_PAYLOAD = 'RemovePayload',
    SAVED_RESULT = 'SavedResult',
    RETRIEVED_RESULT = 'RetrievedResult',
    REMOVED_RESULT = 'RemovedResult',
    VOID = 'void',
    UNKNOWN = 'unknown',
}

export interface SavePayload<T = unknown> {
    readonly id?: string;
    readonly key: string;
    readonly value: T;
    readonly correlationId?: string;
}

export interface GetPayload {
    readonly id?: string;
    readonly key: string;
    readonly correlationId?: string;
}

export interface RemovePayload {
    readonly id?: string;
    readonly key: string;
    readonly correlationId?: string;
}

export interface SavedResult<T = unknown> {
    readonly key: string;
    readonly value: T;
    readonly correlationId?: string;
}

export interface RetrievedResult<T = unknown> {
    readonly key: string;
    readonly value: T | null;
    readonly correlationId?: string;
}

export interface RemovedResult {
    readonly key: string;
    readonly correlationId?: string;
}

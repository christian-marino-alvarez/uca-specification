export {
    type Body,
    type CacheContext,
    type CacheResult,
    type CacheValidation,
    type Recall,
    type Remember,
    type StoredEntry,
} from './schema.js';

export enum SignalType {
    RECALL = 'memory.recall',
    REMEMBER = 'memory.remember',
    RECALLED = 'memory.recalled',
    REMEMBERED = 'memory.remembered',
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
    RECALL = 'Recall',
    REMEMBER = 'Remember',
    CACHE_RESULT = 'CacheResult',
    SAVE_PAYLOAD = 'SavePayload',
    GET_PAYLOAD = 'GetPayload',
    REMOVE_PAYLOAD = 'RemovePayload',
    RESULT = 'Result',
    VOID = 'void',
    UNKNOWN = 'unknown',
}

export enum CacheOperation {
    RECALL = 'recall',
    REMEMBER = 'remember',
}

export enum ValidationStage {
    REQUEST = 'request',
    ENTRY = 'entry',
    ENTRIES = 'entries',
}

export enum StorageStage {
    ENTRY = 'entry',
    TOUCH = 'touch',
    MISS = 'miss',
    PRUNE = 'prune',
}

export interface SavePayload {
    readonly key: string;
    readonly value: unknown;
    readonly sessionId?: string;
}

export interface GetPayload {
    readonly key: string;
    readonly sessionId?: string;
}

export interface RemovePayload extends GetPayload {}

export interface SavedResult {
    readonly key: string;
    readonly value: unknown;
    readonly sessionId?: string;
}

export interface RetrievedResult {
    readonly key: string;
    readonly value: unknown;
    readonly sessionId?: string;
}

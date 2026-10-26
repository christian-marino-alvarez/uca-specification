export {
    type Body,
    type MemoryEntry,
    type MemoryPayload,
    type MemoryQuery,
    type MemoryResult,
} from './schema.js';

export enum StorageType {
    LOCAL_STORAGE = 'localStorage',
    SESSION_STORAGE = 'sessionStorage',
}

export enum SignalType {
    GET = 'memory.get',
    SET = 'memory.set',
    CLEAR = 'memory.clear',
    SAVED = 'memory.saved',
    RETRIEVED = 'memory.retrieved',
    CLEARED = 'memory.cleared',
    ERROR = 'memory.error',
}

export enum DataType {
    PAYLOAD = 'MemoryPayload',
    QUERY = 'MemoryQuery',
    RESULT = 'MemoryResult',
    VOID = 'void',
    ERROR = 'Error',
}

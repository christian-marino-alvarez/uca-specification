export enum SignalType {
    SET = 'local-storage.set',
    GET = 'local-storage.get',
    REMOVE = 'local-storage.remove',
    CLEAR = 'local-storage.clear',
    SAVED = 'local-storage.saved',
    RETRIEVED = 'local-storage.retrieved',
    REMOVED = 'local-storage.removed',
    CLEARED = 'local-storage.cleared',
    ERROR = 'local-storage.error',
}

export enum DataType {
    ITEM_PAYLOAD = 'ItemPayload',
    KEY_PAYLOAD = 'KeyPayload',
    STORED_ITEM = 'StoredItem',
    VOID = 'void',
    ERROR = 'unknown',
}

export interface ItemPayload {
    readonly key: string;
    readonly value: string;
    readonly [extra: string]: unknown;
}

export interface KeyPayload {
    readonly key: string;
    readonly [extra: string]: unknown;
}

export interface StoredItem {
    readonly key: string;
    readonly value: string | null;
    readonly [extra: string]: unknown;
}

export interface StorageError {
    readonly operation: string;
    readonly error: unknown;
    readonly key?: string;
}

export interface Body {
    readonly id?: string;
    readonly ownerId?: string;
    readonly prefix?: string;
    readonly storage?: Storage;
}

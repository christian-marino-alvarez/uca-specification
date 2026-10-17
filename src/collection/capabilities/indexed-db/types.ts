export enum SignalType {
    SET = 'indexed-db.set',
    GET = 'indexed-db.get',
    REMOVE = 'indexed-db.remove',
    REMOVE_MANY = 'indexed-db.remove-many',
    CLEAR = 'indexed-db.clear',
    ENTRIES = 'indexed-db.entries',
    SAVED = 'indexed-db.saved',
    RETRIEVED = 'indexed-db.retrieved',
    REMOVED = 'indexed-db.removed',
    CLEARED = 'indexed-db.cleared',
    LISTED = 'indexed-db.listed',
    ERROR = 'indexed-db.error',
}

export enum DataType {
    ITEM = 'Item',
    KEY = 'Key',
    KEYS = 'Keys',
    RESULT = 'Result',
    VOID = 'void',
    ERROR = 'Error',
}

export interface Body {
    readonly id?: string;
    readonly databaseName?: string;
    readonly storeName?: string;
    readonly version?: number;
}

export interface ItemPayload {
    readonly key: string;
    readonly value: unknown;
    readonly targetId?: string;
    readonly [extra: string]: unknown;
}

export interface KeyPayload {
    readonly key: string;
    readonly targetId?: string;
    readonly [extra: string]: unknown;
}

export interface KeysPayload {
    readonly keys: readonly string[];
    readonly targetId?: string;
    readonly [extra: string]: unknown;
}

export interface Entry {
    readonly key: string;
    readonly value: unknown;
}

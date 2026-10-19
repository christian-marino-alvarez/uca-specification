export type { Body } from './schema.js';

export enum SignalType {
    RENDER = 'symbol.render',
    UPDATE = 'symbol.update',
    REMOVE = 'symbol.remove',
    CREATED = 'symbol.created',
    UPDATED = 'symbol.updated',
    REMOVED = 'symbol.removed',
    CHANGED = 'symbol.changed',
    ERROR = 'symbol.error',
}

export enum DataType {
    BODY = 'Body',
    ERROR = 'Error',
}

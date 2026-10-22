export type { Body, Qualities } from './schema.js';

export enum SignalType {
    RENDER = 'access.render',
    UPDATE = 'access.update',
    REMOVE = 'access.remove',
    CREATED = 'access.created',
    UPDATED = 'access.updated',
    REMOVED = 'access.removed',
    ACTIVATED = 'access.activated',
    ERROR = 'access.error',
}

export enum DataType {
    BODY = 'Body',
    ERROR = 'Error',
}

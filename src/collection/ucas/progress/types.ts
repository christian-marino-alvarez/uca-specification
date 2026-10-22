export type { Body, Qualities } from './schema.js';

export enum SignalType {
    RENDER = 'progress.render',
    UPDATE = 'progress.update',
    REMOVE = 'progress.remove',
    CREATED = 'progress.created',
    UPDATED = 'progress.updated',
    REMOVED = 'progress.removed',
    CHANGED = 'progress.changed',
    ERROR = 'progress.error',
}

export enum DataType {
    BODY = 'Body',
    ERROR = 'Error',
}

export type { Body } from './schema.js';

export enum SignalType {
    RENDER = 'heading.render',
    UPDATE = 'heading.update',
    REMOVE = 'heading.remove',
    CREATED = 'heading.created',
    UPDATED = 'heading.updated',
    REMOVED = 'heading.removed',
    CHANGED = 'heading.changed',
    ERROR = 'heading.error',
}

export enum DataType {
    BODY = 'Body',
    ERROR = 'Error',
}

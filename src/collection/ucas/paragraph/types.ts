export type { Body, Qualities } from './schema.js';

export enum SignalType {
    RENDER = 'paragraph.render',
    UPDATE = 'paragraph.update',
    REMOVE = 'paragraph.remove',
    CREATED = 'paragraph.created',
    UPDATED = 'paragraph.updated',
    REMOVED = 'paragraph.removed',
    CHANGED = 'paragraph.changed',
    ERROR = 'paragraph.error',
}

export enum DataType {
    BODY = 'Body',
    ERROR = 'Error',
}

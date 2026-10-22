export type { Body, Qualities } from './schema.js';

export enum SignalType {
    RENDER = 'separator.render',
    UPDATE = 'separator.update',
    REMOVE = 'separator.remove',
    CREATED = 'separator.created',
    UPDATED = 'separator.updated',
    REMOVED = 'separator.removed',
    CHANGED = 'separator.changed',
    ERROR = 'separator.error',
}

export enum DataType {
    BODY = 'Body',
    ERROR = 'Error',
}

export enum Orientation {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical',
}

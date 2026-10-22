export { type Body, type Qualities, bodySchema, qualitiesSchema } from './schema.js';

export enum SignalType {
    RENDER = 'quantity.render',
    UPDATE = 'quantity.update',
    REMOVE = 'quantity.remove',
    CREATED = 'quantity.created',
    UPDATED = 'quantity.updated',
    REMOVED = 'quantity.removed',
    CHANGED = 'quantity.changed',
    ERROR = 'quantity.error',
}

export enum DataType {
    BODY = 'Body',
    ERROR = 'Error',
}

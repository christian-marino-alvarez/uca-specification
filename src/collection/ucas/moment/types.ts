export { type Body, type Qualities, bodySchema, qualitiesSchema } from './schema.js';

export enum SignalType {
    RENDER = 'moment.render',
    UPDATE = 'moment.update',
    REMOVE = 'moment.remove',
    CREATED = 'moment.created',
    UPDATED = 'moment.updated',
    REMOVED = 'moment.removed',
    CHANGED = 'moment.changed',
    ERROR = 'moment.error',
}

export enum DataType {
    BODY = 'Body',
    ERROR = 'Error',
}

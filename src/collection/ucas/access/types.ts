export type { Body, Qualities, RenderPayload } from './schema.js';

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
    RENDER_PAYLOAD = 'RenderPayload',
    BODY = 'Body',
    ERROR = 'Error',
}

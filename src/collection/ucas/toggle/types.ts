export type { Body, Qualities, RenderPayload } from './schema.js';

export enum SignalType {
    RENDER = 'toggle.render',
    UPDATE = 'toggle.update',
    REMOVE = 'toggle.remove',
    CREATED = 'toggle.created',
    UPDATED = 'toggle.updated',
    REMOVED = 'toggle.removed',
    CHANGED = 'toggle.changed',
    ERROR = 'toggle.error',
}

export enum DataType {
    BODY = 'Body',
    RENDER_PAYLOAD = 'RenderPayload',
    ERROR = 'Error',
}

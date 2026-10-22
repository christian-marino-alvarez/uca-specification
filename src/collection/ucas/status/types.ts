export type { Body, Qualities, RenderPayload } from './schema.js';

export enum SignalType {
    RENDER = 'status.render',
    UPDATE = 'status.update',
    REMOVE = 'status.remove',
    CREATED = 'status.created',
    UPDATED = 'status.updated',
    REMOVED = 'status.removed',
    CHANGED = 'status.changed',
    ERROR = 'status.error',
}

export enum DataType {
    BODY = 'Body',
    RENDER_PAYLOAD = 'RenderPayload',
    ERROR = 'Error',
}

export enum Tone {
    NEUTRAL = 'neutral',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
}

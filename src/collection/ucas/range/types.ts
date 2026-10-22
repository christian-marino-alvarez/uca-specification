export {
    type Body,
    type Qualities,
    type RenderPayload,
    bodySchema,
    qualitiesSchema,
    renderPayloadSchema,
} from './schema.js';

export enum SignalType {
    RENDER = 'range.render',
    UPDATE = 'range.update',
    REMOVE = 'range.remove',
    CREATED = 'range.created',
    UPDATED = 'range.updated',
    REMOVED = 'range.removed',
    CHANGED = 'range.changed',
    ERROR = 'range.error',
}

export enum DataType {
    BODY = 'Body',
    RENDER_PAYLOAD = 'RenderPayload',
    ERROR = 'Error',
}

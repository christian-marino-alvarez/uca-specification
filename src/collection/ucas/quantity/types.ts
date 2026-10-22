export {
    type Body,
    type Qualities,
    type RenderPayload,
    bodySchema,
    qualitiesSchema,
    renderPayloadSchema,
} from './schema.js';

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
    RENDER_PAYLOAD = 'RenderPayload',
    ERROR = 'Error',
}

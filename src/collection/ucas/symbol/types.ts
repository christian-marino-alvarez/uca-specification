export {
    type Body,
    type Qualities,
    type RenderPayload,
    bodySchema,
    qualitiesSchema,
    renderPayloadSchema,
} from './schema.js';

export enum SignalType {
    RENDER = 'symbol.render',
    UPDATE = 'symbol.update',
    REMOVE = 'symbol.remove',
    CREATED = 'symbol.created',
    UPDATED = 'symbol.updated',
    REMOVED = 'symbol.removed',
    CHANGED = 'symbol.changed',
    ERROR = 'symbol.error',
}

export enum DataType {
    BODY = 'Body',
    RENDER_PAYLOAD = 'RenderPayload',
    ERROR = 'Error',
}

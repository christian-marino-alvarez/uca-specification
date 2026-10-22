export {
    type Body,
    type Qualities,
    type RenderPayload,
    bodySchema,
    qualitiesSchema,
    renderPayloadSchema,
} from './schema.js';

export enum SignalType {
    RENDER = 'choice.render',
    UPDATE = 'choice.update',
    REMOVE = 'choice.remove',
    CREATED = 'choice.created',
    UPDATED = 'choice.updated',
    REMOVED = 'choice.removed',
    CHANGED = 'choice.changed',
    ERROR = 'choice.error',
}

export enum DataType {
    BODY = 'Body',
    RENDER_PAYLOAD = 'RenderPayload',
    ERROR = 'Error',
}

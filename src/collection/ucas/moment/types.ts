export {
    type Body,
    type Qualities,
    type RenderPayload,
    bodySchema,
    qualitiesSchema,
    renderPayloadSchema,
} from './schema.js';

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
    RENDER_PAYLOAD = 'RenderPayload',
    ERROR = 'Error',
}

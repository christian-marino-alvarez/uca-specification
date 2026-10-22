export {
    type Body,
    type Qualities,
    type RenderPayload,
    bodySchema,
    qualitiesSchema,
    renderPayloadSchema,
} from './schema.js';

export enum SignalType {
    RENDER = 'picture.render',
    UPDATE = 'picture.update',
    REMOVE = 'picture.remove',
    CREATED = 'picture.created',
    UPDATED = 'picture.updated',
    REMOVED = 'picture.removed',
    ERROR = 'picture.error',
}

export enum DataType {
    BODY = 'Body',
    RENDER_PAYLOAD = 'RenderPayload',
    UPDATE_PAYLOAD = 'UpdatePayload',
    REMOVE_PAYLOAD = 'RemovePayload',
    CREATED_RESULT = 'CreatedResult',
    UPDATED_RESULT = 'UpdatedResult',
    REMOVED_RESULT = 'RemovedResult',
    UNKNOWN = 'unknown',
}

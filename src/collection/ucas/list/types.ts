export type {
    Body,
    ListItem,
    Qualities,
    RenderPayload,
} from './schema.js';

export enum SignalType {
    RENDER = 'list.render',
    UPDATE = 'list.update',
    REMOVE = 'list.remove',
    CREATED = 'list.created',
    UPDATED = 'list.updated',
    REMOVED = 'list.removed',
    ERROR = 'list.error',
}

export enum DataType {
    RENDER_PAYLOAD = 'RenderPayload',
    UPDATE_PAYLOAD = 'UpdatePayload',
    REMOVE_PAYLOAD = 'RemovePayload',
    CREATED_RESULT = 'CreatedResult',
    UPDATED_RESULT = 'UpdatedResult',
    REMOVED_RESULT = 'RemovedResult',
    UNKNOWN = 'unknown',
}

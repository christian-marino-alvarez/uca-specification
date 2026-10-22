export {
    type Body,
    type Qualities,
    type RenderPayload,
    bodySchema,
    qualitiesSchema,
    renderPayloadSchema,
} from './schema.js';

export enum SignalType {
    RENDER = 'action.render',
    UPDATE = 'action.update',
    REMOVE = 'action.remove',
    CREATED = 'action.created',
    UPDATED = 'action.updated',
    REMOVED = 'action.removed',
    EVENT = 'action.event',
    ERROR = 'action.error',
}

export enum DataType {
    BODY = 'Body',
    RENDER_PAYLOAD = 'RenderPayload',
    UPDATE_PAYLOAD = 'UpdatePayload',
    REMOVE_PAYLOAD = 'RemovePayload',
    CREATED_RESULT = 'CreatedResult',
    UPDATED_RESULT = 'UpdatedResult',
    REMOVED_RESULT = 'RemovedResult',
    EVENT_CONTEXT = 'EventContext',
    UNKNOWN = 'unknown',
}

export interface EventContext {
    readonly elementId: string;
    readonly event: string;
    readonly action?: string;
    readonly value?: unknown;
    readonly checked?: boolean;
    readonly detail?: unknown;
}

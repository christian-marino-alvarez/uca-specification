export { type Body, type Qualities, bodySchema, qualitiesSchema } from './schema.js';

export enum SignalType {
    RENDER = 'collection.render',
    UPDATE = 'collection.update',
    REMOVE = 'collection.remove',
    CREATED = 'collection.created',
    UPDATED = 'collection.updated',
    REMOVED = 'collection.removed',
    EVENT = 'collection.event',
    ERROR = 'collection.error',
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

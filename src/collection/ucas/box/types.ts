export { type Body, type Qualities, bodySchema, qualitiesSchema } from './schema.js';

export enum SignalType {
    RENDER = 'box.render',
    UPDATE = 'box.update',
    REMOVE = 'box.remove',
    CREATED = 'box.created',
    UPDATED = 'box.updated',
    REMOVED = 'box.removed',
    EVENT = 'box.event',
    ERROR = 'box.error',
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

export interface CreatedResult {
    readonly elementId: string;
    readonly context?: unknown;
}

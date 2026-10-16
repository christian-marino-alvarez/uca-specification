export { type Body, type OptionItem, type Qualities, bodySchema, optionItemSchema, qualitiesSchema } from './schema.js';

export enum SignalType {
    RENDER = 'options.render',
    UPDATE = 'options.update',
    REMOVE = 'options.remove',
    CREATED = 'options.created',
    UPDATED = 'options.updated',
    REMOVED = 'options.removed',
    EVENT = 'options.event',
    ERROR = 'options.error',
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

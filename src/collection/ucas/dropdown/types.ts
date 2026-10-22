export {
    type Body,
    type DropdownItem,
    type Qualities,
    type RenderPayload,
    bodySchema,
    dropdownItemSchema,
    qualitiesSchema,
    renderPayloadSchema,
} from './schema.js';

export enum SignalType {
    RENDER = 'dropdown.render',
    UPDATE = 'dropdown.update',
    REMOVE = 'dropdown.remove',
    CREATED = 'dropdown.created',
    UPDATED = 'dropdown.updated',
    REMOVED = 'dropdown.removed',
    EVENT = 'dropdown.event',
    ERROR = 'dropdown.error',
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

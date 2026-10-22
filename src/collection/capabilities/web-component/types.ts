export enum SignalType {
    RENDER = 'component.render',
    UPDATE = 'component.update',
    REMOVE = 'component.remove',
    RENDERED = 'component.rendered',
    UPDATED = 'component.updated',
    REMOVED = 'component.removed',
    EVENT = 'component.event',
    ERROR = 'component.error',
}

export enum DataType {
    BODY = 'Body',
    RENDER_PAYLOAD = 'RenderPayload',
    UPDATE_PAYLOAD = 'UpdatePayload',
    REMOVE_PAYLOAD = 'RemovePayload',
    RENDERED_RESULT = 'RenderedResult',
    UPDATED_RESULT = 'UpdatedResult',
    REMOVED_RESULT = 'RemovedResult',
    EVENT_CONTEXT = 'EventContext',
    UNKNOWN = 'unknown',
}

export interface Body {
    readonly attributes?: Record<string, string>;
    readonly content?: string;
    readonly events?: readonly string[];
    readonly defaultTag?: string;
}

export interface RenderPayload {
    readonly elementId?: string;
    readonly tag?: string;
    readonly containerElement?: string;
    readonly attributes?: Record<string, string>;
    readonly content?: string;
    readonly events?: readonly string[];
    readonly context?: unknown;
}

export interface UpdatePayload {
    readonly elementId?: string;
    readonly attributes?: Record<string, string>;
    readonly content?: string;
    readonly events?: readonly string[];
    readonly context?: unknown;
}

export interface RemovePayload {
    readonly elementId?: string;
    readonly context?: unknown;
}

export interface RenderedResult {
    readonly elementId: string;
    readonly tag: string;
    readonly context?: unknown;
}

export interface UpdatedResult {
    readonly elementId: string;
    readonly updated: boolean;
    readonly context?: unknown;
}

export interface RemovedResult {
    readonly elementId: string;
    readonly removed: boolean;
    readonly context?: unknown;
}

export interface EventContext {
    readonly elementId: string;
    readonly rootElementId?: string;
    readonly event: string;
    readonly action?: string;
    readonly value?: unknown;
    readonly checked?: boolean;
    readonly detail?: unknown;
    readonly context?: unknown;
}

import type { Disposition } from '@uca/core/types';

export enum SignalType {
    EVENT = 'component.event',
    RENDERED = 'element.rendered',
    UPDATED = 'element.updated',
    REMOVED = 'element.removed',
    CONNECTED = 'element.connected',
    DISCONNECTED = 'element.disconnected',
    ATTRIBUTE_CHANGED = 'element.attributeChanged',
    CONTENT_CHANGED = 'element.contentChanged',
    TAG_CHANGED = 'element.tagChanged',
}

export enum LifecycleEventType {
    CONNECTED = 'lifecycle.connected',
    DISCONNECTED = 'lifecycle.disconnected',
    ATTRIBUTE_CHANGED = 'lifecycle.attributeChanged',
    CONTENT_CHANGED = 'lifecycle.contentChanged',
    TAG_CHANGED = 'lifecycle.tagChanged',
}

export enum DataType {
    HTML_ELEMENT = 'HTMLElement',
    RECORD = 'Record<string, unknown>',
    VOID = 'void',
    EVENT_CONTEXT = 'EventContext',
    LIFECYCLE_CONTEXT = 'LifecycleContext',
}

export interface Body {
    readonly id?: string;
    readonly tag?: string;
    readonly observedAttributes?: readonly string[];
    readonly attributes?: Readonly<Record<string, string>>;
    readonly text?: string;
    readonly container?: HTMLElement;
}

export interface Config<TBody = Body> {
    readonly id?: string;
    readonly reactTo?: readonly string[];
    readonly body?: TBody;
    readonly disposition?: Disposition<TBody>;
    readonly target?: EventTarget;
    readonly container?: HTMLElement;
    readonly tag?: string;
    readonly observedAttributes?: readonly string[];
}

export interface LifecycleContext {
    readonly id: string;
    readonly tag?: string;
    readonly attribute?: string;
    readonly oldValue?: string | null;
    readonly newValue?: string | null;
    readonly content?: string;
    readonly oldTag?: string;
    readonly newTag?: string;
}

export interface ReactiveCustomElementConstructor extends CustomElementConstructor {
    readonly observedAttributes?: readonly string[];
}

export interface EventContext {
    readonly id: string;
    readonly event: string;
    readonly value?: unknown;
    readonly checked?: boolean;
    readonly detail?: unknown;
}


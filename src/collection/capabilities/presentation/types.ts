import type { Body as ComponentBody, RenderPayload } from '@uca/capability-web-component/types';

export enum Kind {
    HEADING = 'heading',
    PARAGRAPH = 'paragraph',
    ACCESS = 'access',
    CHOICE = 'choice',
    TOGGLE = 'toggle',
    RANGE = 'range',
    QUANTITY = 'quantity',
    MOMENT = 'moment',
    SYMBOL = 'symbol',
    STATUS = 'status',
    PROGRESS = 'progress',
    SEPARATOR = 'separator',
}

export enum SignalType {
    RENDER = 'presentation.render',
    UPDATE = 'presentation.update',
    REMOVE = 'presentation.remove',
}

export enum InteractionType {
    CLICK = 'click',
    INPUT = 'input',
    CHANGE = 'change',
}

export interface Body extends ComponentBody {
    readonly kind?: Kind;
}

export interface Item {
    readonly value: string;
    readonly label: string;
    readonly selected?: boolean;
    readonly disabled?: boolean;
}

export interface Content {
    readonly elementId?: string;
    readonly parentId?: string;
    readonly parentTo?: string;
    readonly containerElement?: string;
    readonly context?: unknown;
    readonly text?: string;
    readonly label?: string;
    readonly description?: string;
    readonly name?: string;
    readonly destination?: string;
    readonly value?: string | number | boolean;
    readonly importance?: number;
    readonly minimum?: number | string;
    readonly maximum?: number | string;
    readonly step?: number;
    readonly total?: number;
    readonly unit?: string;
    readonly disabled?: boolean;
    readonly required?: boolean;
    readonly placeholder?: string;
    readonly items?: readonly Item[];
    readonly tone?: string;
    readonly orientation?: string;
}

export interface Projection {
    readonly tag: string;
    readonly attributes: Record<string, string>;
    readonly content?: string;
}

export type Projector = (body: Content) => Projection;
export type Payload = RenderPayload;

export enum DataType {
    CONTENT = 'Content',
}

export interface Binding {
    readonly body: Content;
    readonly operation: SignalType;
}

export interface Response {
    readonly context: Binding;
    readonly elementId?: string;
    readonly value?: unknown;
    readonly checked?: boolean;
}

export interface Channel {
    readonly property: string;
    readonly value: unknown;
}

export enum ControlType {
    TOGGLE = 'checkbox',
    RANGE = 'range',
    QUANTITY = 'number',
    MOMENT = 'date',
}

export enum Role {
    SYMBOL = 'img',
    STATUS = 'status',
}

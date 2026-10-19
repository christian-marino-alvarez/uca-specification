import type { Disposition } from '@uca/core/types';

export enum Operation {
    RENDER = 'render',
    UPDATE = 'update',
    REMOVE = 'remove',
    CHANGE = 'change',
}

export interface Lifecycle<TBody> {
    readonly context: TBody;
}

export interface Interaction<TBody> {
    readonly context: TBody;
    readonly value?: string;
    readonly checked?: boolean;
}

export interface DomainConfiguration<TBody> {
    readonly disposition: Disposition<TBody>;
}

export interface StyledBody {
    readonly elementId?: string;
    readonly qualities?: unknown;
}

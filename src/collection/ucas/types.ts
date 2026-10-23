import type { Disposition } from '@uca/core/types';
import type { z } from 'zod';
import type {
    areaContainerDimensionsSchema,
    limitsSchema,
    signalBodySchema,
    signalSchema,
    webContextSchema,
    webSignalBodySchema,
} from './schema.js';

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

export type AreaContainerDimensions = z.infer<typeof areaContainerDimensionsSchema>;
export type Limits = z.infer<typeof limitsSchema>;

export type WebContext = z.infer<typeof webContextSchema>;

export type SignalBody<TContext = Record<string, unknown>> = Omit<z.infer<typeof signalBodySchema>, 'context'> & {
    readonly context: TContext;
};

export type WebSignalBody = z.infer<typeof webSignalBodySchema>;

export type SignalTransport<T = unknown> = Omit<z.infer<typeof signalSchema>, 'value'> & {
    readonly value: T;
};

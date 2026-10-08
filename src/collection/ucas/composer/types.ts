import type {
    Body,
    ComposePayload,
    ComposedResult,
    CustomCssRule,
    TemplateNode,
} from './schema.js';

export enum SignalType {
    COMPOSE = 'composer.compose',
    COMPOSED = 'composer.composed',
    DESTROY = 'composer.destroy',
    DESTROYED = 'composer.destroyed',
    ERROR = 'composer.error',
}

export enum DataType {
    COMPOSE_PAYLOAD = 'ComposePayload',
    COMPOSED_RESULT = 'ComposedResult',
    VOID = 'void',
    UNKNOWN = 'unknown',
}

export type { Body, ComposePayload, ComposedResult, CustomCssRule, TemplateNode };

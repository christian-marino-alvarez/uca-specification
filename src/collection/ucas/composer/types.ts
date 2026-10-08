import type {
    Body,
    ComposePayload,
    ComposedResult,
    ComposeStreamPayload,
    ComposeStreamResult,
    CustomCssRule,
    TemplateNode,
} from './schema.js';

export enum SignalType {
    COMPOSE = 'composer.compose',
    COMPOSED = 'composer.composed',
    STREAM = 'composer.stream',
    STREAMED = 'composer.streamed',
    DESTROY = 'composer.destroy',
    DESTROYED = 'composer.destroyed',
    ERROR = 'composer.error',
}

export enum DataType {
    COMPOSE_PAYLOAD = 'ComposePayload',
    COMPOSED_RESULT = 'ComposedResult',
    STREAM_PAYLOAD = 'ComposeStreamPayload',
    STREAM_RESULT = 'ComposeStreamResult',
    VOID = 'void',
    UNKNOWN = 'unknown',
}

export type {
    Body,
    ComposePayload,
    ComposedResult,
    ComposeStreamPayload,
    ComposeStreamResult,
    CustomCssRule,
    TemplateNode,
};

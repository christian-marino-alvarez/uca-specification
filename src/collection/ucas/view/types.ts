export type {
    Body,
    BuildPayload,
    BuiltResult,
    ComponentItem,
    CreatedResult,
    RenderedResult,
    ViewBody,
    ViewComposition,
} from './schema.js';

export interface ContractParams {
    readonly purpose: string;
    readonly goal: string;
    readonly outputSchema: Record<string, unknown>;
    readonly limits: Record<string, unknown>;
}

export enum SignalType {
    BUILD = 'view.build',
    BUILT = 'view.built',
    RENDERED = 'view.rendered',
    CREATED = 'view.created',
    ERROR = 'view.error',
}

export enum DataType {
    BUILD_PAYLOAD = 'BuildPayload',
    BUILT_RESULT = 'BuiltResult',
    CREATED_RESULT = 'CreatedResult',
    RENDERED_RESULT = 'RenderedResult',
    BODY = 'Body',
    ERROR = 'Error',
    UNKNOWN = 'unknown',
}

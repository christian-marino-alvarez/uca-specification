export type {
    Area,
    AreaCreated,
    Body,
    BuildPayload,
    BuiltResult,
    Choice,
    ComponentInfo,
    ComponentItem,
    LayoutComposition,
    ViewComposition,
} from './schema.js';

export interface ContractParams {
    readonly purpose: string;
    readonly goal: string;
    readonly outputSchema: Record<string, unknown>;
    readonly limits: Record<string, unknown>;
}

export enum SignalType {
    BUILD = 'builder.build',
    BUILT = 'builder.built',
    AREA_CREATED = 'builder.area-created',
    ERROR = 'builder.error',
}

export enum DataType {
    BUILD_PAYLOAD = 'BuildPayload',
    BUILT_RESULT = 'BuiltResult',
    AREA_CREATED = 'AreaCreated',
    BODY = 'Body',
    ERROR = 'Error',
    UNKNOWN = 'unknown',
}

export interface StreamChunk {
    readonly correlationId?: string;
    readonly item: unknown;
    readonly context: import('./schema.js').BuildPayload;
}

export interface StreamComplete {
    readonly correlationId?: string;
    readonly items: unknown[];
    readonly context: import('./schema.js').BuildPayload;
}

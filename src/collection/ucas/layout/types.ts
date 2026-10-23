export type {
    Area,
    AreaConcept,
    AreaDefined,
    Body,
    BuildPayload,
    BuiltResult,
    LayoutBody,
    LayoutComposition,
    Qualities,
    ContainerQualities,
} from './schema.js';

export interface ContractParams {
    readonly purpose: string;
    readonly goal: string;
    readonly outputSchema: Record<string, unknown>;
}

export interface SpatialPiece {
    readonly name: string;
    readonly category: string;
    readonly description: string;
    readonly values?: readonly string[];
}

export enum SignalType {
    BUILD = 'layout.build',
    BUILT = 'layout.built',
    AREA_DEFINED = 'layout.area-defined',
    AREA_CREATED = 'layout.area-created',
    ERROR = 'layout.error',
}

export enum DataType {
    BUILD_PAYLOAD = 'BuildPayload',
    BUILT_RESULT = 'BuiltResult',
    AREA_DEFINED = 'AreaDefined',
    AREA_CREATED = 'AreaCreated',
    BODY = 'Body',
    ERROR = 'Error',
    UNKNOWN = 'unknown',
}

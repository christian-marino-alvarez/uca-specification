export { type Body, bodySchema } from './schema.js';

export enum SignalType {
    BUILD = 'builder.build',
    SKELETON = 'builder.skeleton',
    EVALUATE = 'builder.evaluate',
    BUILT = 'builder.built',
    SUBDIVIDE = 'builder.subdivide',
    ERROR = 'builder.error',
}

export enum DataType {
    BODY = 'Body',
    BUILD_PAYLOAD = 'BuildPayload',
    SKELETON_PAYLOAD = 'SkeletonPayload',
    EVALUATE_PAYLOAD = 'EvaluatePayload',
    BUILT_RESULT = 'BuiltResult',
    SUBDIVIDE_RESULT = 'SubdivideResult',
    UNKNOWN = 'unknown',
}

export interface BuildPayload {
    readonly areaId: string;
    readonly purpose?: string;
    readonly context?: string;
    readonly parentTo?: string;
    readonly dimensions?: { width?: string | number; height?: string | number };
    readonly style?: Record<string, string>;
}

export interface SkeletonPayload {
    readonly areaId: string;
    readonly parentTo?: string;
    readonly dimensions?: { width?: string | number; height?: string | number };
    readonly style?: Record<string, string>;
}

export interface EvaluatePayload {
    readonly areaId: string;
    readonly purpose?: string;
    readonly context?: string;
    readonly parentTo?: string;
    readonly dimensions?: { width?: string | number; height?: string | number };
}

export interface BuiltResult {
    readonly areaId: string;
    readonly success: boolean;
}

export interface SubdivideResult {
    readonly areaId: string;
    readonly reason?: string;
}

export interface Dimensions {
    readonly width?: string | number;
    readonly height?: string | number;
}

export interface AreaPayload {
    readonly areaId?: string;
    readonly elementId?: string;
    readonly purpose?: string;
    readonly kind?: string;
    readonly context?: string;
    readonly parentTo?: string;
    readonly depth?: number;
    readonly dimensions?: Dimensions;
    readonly style?: Record<string, string>;
    readonly media?: { readonly minWidth?: number; readonly maxWidth?: number; readonly orientation?: string };
    readonly subdivided?: boolean;
}

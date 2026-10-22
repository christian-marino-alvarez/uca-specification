export {
    type Appearance,
    type Body,
    type ClearPayload,
    type DeterministicPayload,
    type ErrorResult,
    type InferencePayload,
    type LayoutArea,
    type RenderModeType,
    type RenderPayload,
    type RenderedResult,
    type SkeletonPayload,
    appearanceSchema,
    bodySchema,
    clearPayloadSchema,
    deterministicPayloadSchema,
    errorSchema,
    inferencePayloadSchema,
    layoutAreaSchema,
    renderModeSchema,
    renderPayloadSchema,
    renderedResultSchema,
    skeletonPayloadSchema,
} from './schema.js';

export enum SignalType {
    RENDER = 'render.render',
    SKELETON = 'render.skeleton',
    CLEAR = 'render.clear',
    RENDERED = 'render.rendered',
    AREA_CREATED = 'render.area-created',
    SKELETON_ATTACHED = 'render.skeleton-attached',
    CLEARED = 'render.cleared',
    ERROR = 'render.error',
}

export enum DataType {
    RENDER_PAYLOAD = 'RenderPayload',
    SKELETON_PAYLOAD = 'SkeletonPayload',
    CLEAR_PAYLOAD = 'ClearPayload',
    RENDERED_RESULT = 'RenderedResult',
    AREA_CREATED = 'AreaCreated',
    ERROR = 'Error',
    UNKNOWN = 'unknown',
}

export enum RenderMode {
    DETERMINISTIC = 'deterministic',
    INFERENCE = 'inference',
}

export enum ComponentType {
    ACTION = 'action',
    PICTURE = 'picture',
    INPUT = 'input',
    COLLECTION = 'collection',
    BOX = 'box',
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

export enum MountKind {
    AREA = 'area',
    COMPONENT = 'component',
}

export interface MountContext {
    readonly kind: MountKind;
    readonly area?: import('./schema.js').LayoutArea;
    readonly areaId: string;
    readonly parentId: string;
    readonly correlationId: string;
    readonly context: Record<string, unknown>;
}

export interface CreatedElement {
    readonly elementId: string;
    readonly context?: MountContext;
    readonly detail?: {
        readonly context?: MountContext;
    };
}

export interface LayoutContext {
    readonly correlationId: string;
    readonly context: Record<string, unknown>;
}

export interface RenderChannel {
    readonly id: string;
    readonly queue: unknown[];
    isDraining: boolean;
}

export interface ComponentDef {
    readonly id?: string;
    readonly parentId?: string;
    readonly component?: string;
    readonly content?: string | null;
    readonly text?: string | null;
    readonly label?: string | null;
    readonly title?: string | null;
    readonly src?: string | null;
    readonly qualities?: Record<string, unknown> | null;
}

export interface VisualPrimitive {
    readonly name: string;
    readonly proposito: string;
    readonly intencion: string;
    readonly disposicionVisual?: Record<
        string,
        unknown
    >;
}


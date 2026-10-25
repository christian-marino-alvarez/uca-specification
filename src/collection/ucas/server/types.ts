import type {
    RouteConfig,
    RequestContext,
    ResponsePayload,
    RouteHandler,
    HttpMethod,
    RespondConfig,
} from '@uca/capability-http-server/types';

export enum SignalType {
    START = 'server.start',
    STOP = 'server.stop',
    ROUTE = 'server.route',
    RESPOND = 'server.respond',
    STARTED = 'server.started',
    STOPPED = 'server.stopped',
    REQUEST = 'server.request',
    ERROR = 'server.error',
}

export enum DataType {
    START_CONFIG = 'StartConfig',
    ROUTE_CONFIG = 'RouteConfig',
    RESPOND_CONFIG = 'RespondConfig',
    STARTED_STATUS = 'StartedStatus',
    REQUEST_CONTEXT = 'RequestContext',
    VOID = 'void',
    UNKNOWN = 'unknown',
    INFER_RESULT = 'InferResult',
    STREAM_RESULT = 'StreamResult',
    STREAM_END_RESULT = 'StreamEndResult',
}

export interface StartConfig {
    readonly port?: number;
    readonly hostname?: string;
}

export interface StartedStatus {
    readonly port: number;
    readonly hostname: string;
    readonly url: string;
}

export interface Body {
    readonly port?: number;
    readonly hostname?: string;
    readonly routes?: readonly RouteConfig[];
    readonly autoStart?: boolean;
    readonly staticDir?: string;
    readonly webDir?: string;
}

export type {
    RouteConfig,
    RequestContext,
    ResponsePayload,
    RouteHandler,
    HttpMethod,
    RespondConfig,
};

export type InferenceRequest = import('@uca/llm/types').InferPayload;

export interface EvaluationContext { readonly state?: unknown; readonly questions?: Record<string, unknown>; }
export interface Question extends Record<string, unknown> { readonly instructions?: unknown; }
export interface ValidationContext { readonly stream: boolean; readonly sessionId?: string; }

export interface StreamSource {
    readonly stream?: ReadableStream<string>;
    readonly error?: unknown;
}

export interface Command { readonly property: string; readonly value: unknown; }

export interface StreamBinding {
    readonly source: Promise<StreamSource>;
    readonly sessionId: string;
    readonly abort: AbortController;
    readonly cleanup: () => void;
    readonly completed: () => void;
    reader?: ReadableStreamDefaultReader<string>;
    cancelled: boolean;
}

export interface StreamFrame { readonly text?: string; readonly done?: boolean; readonly error?: string; }

export interface StreamSourceRequest {
    readonly target?: EventTarget;
    readonly source: string;
    readonly sessionId?: string;
    readonly abort: AbortSignal;
    readonly request: () => void;
    readonly cancel: () => void;
}

export interface VisualPlan {
    readonly answers: Record<string, unknown>;
    readonly domains: readonly string[];
}

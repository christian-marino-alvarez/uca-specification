import type {
    RouteConfig,
    RequestContext,
    ResponsePayload,
    RouteHandler,
    HttpMethod,
    RespondConfig,
} from '@uca/capability-http-server';

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

export enum SignalType {
    LISTEN = 'http-server.listen',
    CLOSE = 'http-server.close',
    ROUTE = 'http-server.route',
    RESPOND = 'http-server.respond',
    LISTENING = 'http-server.listening',
    CLOSED = 'http-server.closed',
    REQUEST = 'http-server.request',
    ERROR = 'http-server.error',
}

export enum DataType {
    LISTEN_CONFIG = 'ListenConfig',
    ROUTE_CONFIG = 'RouteConfig',
    RESPOND_CONFIG = 'RespondConfig',
    LISTENING_STATUS = 'ListeningStatus',
    REQUEST_CONTEXT = 'RequestContext',
    VOID = 'void',
    UNKNOWN = 'unknown',
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'ALL';

export interface ResponsePayload {
    readonly status?: number;
    readonly headers?: Record<string, string>;
    readonly body?: unknown;
}

export interface RequestContext {
    readonly requestId: string;
    readonly method: string;
    readonly path: string;
    readonly query: Record<string, string>;
    readonly headers: Record<string, string>;
    readonly body?: unknown;
}

export type RouteHandler = (context: RequestContext) => Response | ResponsePayload | Promise<Response | ResponsePayload>;

export interface RouteConfig {
    readonly method: HttpMethod;
    readonly path: string;
    readonly handler?: RouteHandler;
    readonly response?: ResponsePayload;
}

export interface ListenConfig {
    readonly port?: number;
    readonly hostname?: string;
}

export interface ListeningStatus {
    readonly port: number;
    readonly hostname: string;
    readonly url: string;
}

export interface RespondConfig {
    readonly requestId: string;
    readonly status?: number;
    readonly headers?: Record<string, string>;
    readonly body?: unknown;
}

export interface Body {
    readonly id?: string;
    readonly port?: number;
    readonly hostname?: string;
    readonly routes?: readonly RouteConfig[];
    readonly autoStart?: boolean;
}

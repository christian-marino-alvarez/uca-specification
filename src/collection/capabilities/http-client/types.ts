export interface Body { readonly endpoint?: string; }
export interface RequestPayload { readonly id?: string; readonly endpoint: string; readonly payload: unknown; readonly correlationId?: string; readonly context?: unknown; }
export interface ResponsePayload { readonly data: unknown; readonly correlationId?: string; readonly context?: unknown; }
export interface ErrorPayload { readonly error: string; readonly correlationId?: string; readonly context?: unknown; }
export interface AbortPayload { readonly correlationId?: string; }
export enum SignalType { REQUEST = 'http-client.request', ABORT = 'http-client.abort', RESPONSE = 'http-client.response', ERROR = 'http-client.error' }
export enum DataType { REQUEST = 'RequestPayload', ABORT = 'AbortPayload', RESPONSE = 'ResponsePayload', ERROR = 'ErrorPayload' }

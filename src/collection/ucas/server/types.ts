import type {
  RouteConfig,
  RequestContext,
  ResponsePayload,
  RouteHandler,
  HttpMethod,
  RespondConfig,
} from '@uca/capability-http-server/types';
import type { InferPayload } from '@uca/llm/types';
import type {
  Body,
  PendingRequest,
  StartConfig,
  StartedStatus,
} from './schema.js';

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

export type {
  Body,
  HttpMethod,
  PendingRequest,
  RequestContext,
  RespondConfig,
  ResponsePayload,
  RouteConfig,
  RouteHandler,
  StartConfig,
  StartedStatus,
};

export type InferenceRequest = InferPayload;

export interface OptionDefinition {
  readonly id: string;
  readonly label?: string;
  readonly description?: string;
  readonly criteria?: string;
}

export interface EvaluationContext {
  readonly state?: unknown;
  readonly questions?: Record<string, unknown>;
}

export interface Question extends Record<string, unknown> {
  readonly id?: string;
  readonly prompt?: string;
  readonly instructions?: unknown;
  readonly options?: readonly OptionDefinition[] | Record<string, string>;
  readonly criteria?: Record<string, string>;
}

export interface Command {
  readonly property: string;
  readonly value: unknown;
}

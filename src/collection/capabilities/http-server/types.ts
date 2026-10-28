import type {
  Body,
  HttpMethod,
  ListenConfig,
  ListeningStatus,
  RequestContext,
  RespondConfig,
  ResponsePayload,
  RouteConfig,
  RouteHandler,
} from './schema.js';

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

export type {
  Body,
  HttpMethod,
  ListenConfig,
  ListeningStatus,
  RequestContext,
  RespondConfig,
  ResponsePayload,
  RouteConfig,
  RouteHandler,
};

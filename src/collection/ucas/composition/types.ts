export type {
  AreaTarget,
  Body,
  Choice,
  ComposeRequest,
  ErrorPayload,
} from './schema.js';

export enum SignalType {
  COMPOSE = 'composition.compose',
  ERROR = 'composition.error',
}

export enum DataType {
  BODY = 'Body',
  COMPOSE_REQUEST = 'ComposeRequest',
  ERROR = 'Error',
}

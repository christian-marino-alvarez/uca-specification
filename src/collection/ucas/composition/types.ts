export type {
  AreaEntry,
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

export enum Role {
  SELF = 'self',
  BROWSER = 'browser',
  SPECIFICATION = 'specification',
  DECISION = 'decision',
  LAYOUT = 'layout',
  VIEW = 'view',
}

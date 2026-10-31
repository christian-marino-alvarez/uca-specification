export type {
  Body,
  EventContext,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'access.render',
  UPDATE = 'access.update',
  REMOVE = 'access.remove',
  CREATED = 'access.created',
  UPDATED = 'access.updated',
  REMOVED = 'access.removed',
  EVENT = 'access.event',
  ERROR = 'access.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

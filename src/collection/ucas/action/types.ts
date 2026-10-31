export type {
  Body,
  EventContext,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'action.render',
  UPDATE = 'action.update',
  REMOVE = 'action.remove',
  CREATED = 'action.created',
  UPDATED = 'action.updated',
  REMOVED = 'action.removed',
  EVENT = 'action.event',
  ERROR = 'action.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

export type {
  Body,
  EventContext,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'picture.render',
  UPDATE = 'picture.update',
  REMOVE = 'picture.remove',
  CREATED = 'picture.created',
  UPDATED = 'picture.updated',
  REMOVED = 'picture.removed',
  EVENT = 'picture.event',
  ERROR = 'picture.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

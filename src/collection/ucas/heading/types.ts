export type {
  Body,
  EventContext,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'heading.render',
  UPDATE = 'heading.update',
  REMOVE = 'heading.remove',
  CREATED = 'heading.created',
  UPDATED = 'heading.updated',
  REMOVED = 'heading.removed',
  EVENT = 'heading.event',
  ERROR = 'heading.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

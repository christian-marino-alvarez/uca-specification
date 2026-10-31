export type {
  Body,
  EventContext,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'input.render',
  UPDATE = 'input.update',
  REMOVE = 'input.remove',
  CREATED = 'input.created',
  UPDATED = 'input.updated',
  REMOVED = 'input.removed',
  EVENT = 'input.event',
  ERROR = 'input.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

export type {
  Body,
  EventContext,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'quantity.render',
  UPDATE = 'quantity.update',
  REMOVE = 'quantity.remove',
  CREATED = 'quantity.created',
  UPDATED = 'quantity.updated',
  REMOVED = 'quantity.removed',
  EVENT = 'quantity.event',
  ERROR = 'quantity.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

export type {
  Body,
  EventContext,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'symbol.render',
  UPDATE = 'symbol.update',
  REMOVE = 'symbol.remove',
  CREATED = 'symbol.created',
  UPDATED = 'symbol.updated',
  REMOVED = 'symbol.removed',
  EVENT = 'symbol.event',
  ERROR = 'symbol.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

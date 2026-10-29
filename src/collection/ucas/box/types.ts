export type {
  Body,
  EventContext,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'box.render',
  UPDATE = 'box.update',
  REMOVE = 'box.remove',
  CREATED = 'box.created',
  UPDATED = 'box.updated',
  REMOVED = 'box.removed',
  EVENT = 'box.event',
  ERROR = 'box.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

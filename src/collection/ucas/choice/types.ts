export type {
  Body,
  EventContext,
  Item,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'choice.render',
  UPDATE = 'choice.update',
  REMOVE = 'choice.remove',
  CREATED = 'choice.created',
  UPDATED = 'choice.updated',
  REMOVED = 'choice.removed',
  EVENT = 'choice.event',
  ERROR = 'choice.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

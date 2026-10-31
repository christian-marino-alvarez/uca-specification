export type {
  Body,
  EventContext,
  ListItem,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'list.render',
  UPDATE = 'list.update',
  REMOVE = 'list.remove',
  CREATED = 'list.created',
  UPDATED = 'list.updated',
  REMOVED = 'list.removed',
  EVENT = 'list.event',
  ERROR = 'list.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

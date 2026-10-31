export type {
  Body,
  EventContext,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'moment.render',
  UPDATE = 'moment.update',
  REMOVE = 'moment.remove',
  CREATED = 'moment.created',
  UPDATED = 'moment.updated',
  REMOVED = 'moment.removed',
  EVENT = 'moment.event',
  ERROR = 'moment.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

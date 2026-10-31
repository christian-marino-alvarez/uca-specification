export type {
  Body,
  EventContext,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'progress.render',
  UPDATE = 'progress.update',
  REMOVE = 'progress.remove',
  CREATED = 'progress.created',
  UPDATED = 'progress.updated',
  REMOVED = 'progress.removed',
  EVENT = 'progress.event',
  ERROR = 'progress.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

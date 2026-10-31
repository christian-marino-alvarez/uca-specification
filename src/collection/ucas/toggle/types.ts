export type {
  Body,
  EventContext,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'toggle.render',
  UPDATE = 'toggle.update',
  REMOVE = 'toggle.remove',
  CREATED = 'toggle.created',
  UPDATED = 'toggle.updated',
  REMOVED = 'toggle.removed',
  EVENT = 'toggle.event',
  ERROR = 'toggle.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

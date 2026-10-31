export type {
  Body,
  EventContext,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'status.render',
  UPDATE = 'status.update',
  REMOVE = 'status.remove',
  CREATED = 'status.created',
  UPDATED = 'status.updated',
  REMOVED = 'status.removed',
  EVENT = 'status.event',
  ERROR = 'status.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

export enum Tone {
  NEUTRAL = 'neutral',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export type {
  Body,
  EventContext,
  Qualities,
  Tone,
} from './schema.js';

export enum SignalType {
  RENDER = 'toast.render',
  UPDATE = 'toast.update',
  REMOVE = 'toast.remove',
  CREATED = 'toast.created',
  UPDATED = 'toast.updated',
  REMOVED = 'toast.removed',
  EVENT = 'toast.event',
  ERROR = 'toast.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

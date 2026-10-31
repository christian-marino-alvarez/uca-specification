export type {
  Body,
  EventContext,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'paragraph.render',
  UPDATE = 'paragraph.update',
  REMOVE = 'paragraph.remove',
  CREATED = 'paragraph.created',
  UPDATED = 'paragraph.updated',
  REMOVED = 'paragraph.removed',
  EVENT = 'paragraph.event',
  ERROR = 'paragraph.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

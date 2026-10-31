export type {
  Body,
  EventContext,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'separator.render',
  UPDATE = 'separator.update',
  REMOVE = 'separator.remove',
  CREATED = 'separator.created',
  UPDATED = 'separator.updated',
  REMOVED = 'separator.removed',
  EVENT = 'separator.event',
  ERROR = 'separator.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

export enum Orientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

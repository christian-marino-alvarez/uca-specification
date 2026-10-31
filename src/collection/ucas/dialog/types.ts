export type {
  Body,
  DialogVariant,
  EventContext,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'dialog.render',
  UPDATE = 'dialog.update',
  REMOVE = 'dialog.remove',
  CREATED = 'dialog.created',
  UPDATED = 'dialog.updated',
  REMOVED = 'dialog.removed',
  EVENT = 'dialog.event',
  ERROR = 'dialog.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

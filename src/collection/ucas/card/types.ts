export type {
  Body,
  CardVariant,
  EventContext,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'card.render',
  UPDATE = 'card.update',
  REMOVE = 'card.remove',
  CREATED = 'card.created',
  UPDATED = 'card.updated',
  REMOVED = 'card.removed',
  EVENT = 'card.event',
  ERROR = 'card.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

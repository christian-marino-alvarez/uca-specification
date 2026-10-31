export type {
  Body,
  ChipVariant,
  EventContext,
  Qualities,
} from './schema.js';

export enum SignalType {
  RENDER = 'chip.render',
  UPDATE = 'chip.update',
  REMOVE = 'chip.remove',
  CREATED = 'chip.created',
  UPDATED = 'chip.updated',
  REMOVED = 'chip.removed',
  EVENT = 'chip.event',
  ERROR = 'chip.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

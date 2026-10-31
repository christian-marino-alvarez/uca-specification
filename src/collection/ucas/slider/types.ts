export type {
  Body,
  EventContext,
  Qualities,
  SliderVariant,
} from './schema.js';

export enum SignalType {
  RENDER = 'slider.render',
  UPDATE = 'slider.update',
  REMOVE = 'slider.remove',
  CREATED = 'slider.created',
  UPDATED = 'slider.updated',
  REMOVED = 'slider.removed',
  EVENT = 'slider.event',
  ERROR = 'slider.error',
}

export enum DataType {
  BODY = 'Body',
  EVENT_CONTEXT = 'EventContext',
  ERROR = 'Error',
}

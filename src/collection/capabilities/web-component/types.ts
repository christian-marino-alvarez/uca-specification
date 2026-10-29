export enum SignalType {
  RENDER = 'component.render',
  UPDATE = 'component.update',
  REMOVE = 'component.remove',
  RENDERED = 'component.rendered',
  UPDATED = 'component.updated',
  REMOVED = 'component.removed',
  EVENT = 'component.event',
  ERROR = 'component.error',
}

export enum DataType {
  BODY = 'Body',
  RENDER_PAYLOAD = 'RenderPayload',
  UPDATE_PAYLOAD = 'UpdatePayload',
  REMOVE_PAYLOAD = 'RemovePayload',
  RENDERED_RESULT = 'RenderedResult',
  UPDATED_RESULT = 'UpdatedResult',
  REMOVED_RESULT = 'RemovedResult',
  EVENT_CONTEXT = 'EventContext',
  UNKNOWN = 'unknown',
}

export type ManagedElement = HTMLElement & {
  abortController?: AbortController;
};

export type {
  Body,
  EventContext,
  RemovePayload,
  RemovedResult,
  RenderPayload,
  RenderedResult,
  UpdatePayload,
  UpdatedResult,
} from './schema.js';

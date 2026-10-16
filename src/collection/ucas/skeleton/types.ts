export enum SignalType {
    RENDER = 'skeleton.render',
    REMOVE = 'skeleton.remove',
    DISCARD = 'skeleton.discard',
    RENDERED = 'skeleton.rendered',
    REMOVED = 'skeleton.removed',
    ERROR = 'skeleton.error',
}

export enum DataType {
    RENDER_PAYLOAD = 'RenderPayload',
    REMOVE_PAYLOAD = 'RemovePayload',
    DISCARD_PAYLOAD = 'DiscardPayload',
    RESULT = 'Result',
    ERROR = 'Error',
}

export type {
    Body,
    Dimensions,
    DiscardPayload,
    ErrorResult,
    RemovePayload,
    RenderPayload,
    Result,
    ValidationContext,
} from './schema.js';

export {
    type Result as RenderedResult,
    type Result as RemovedResult,
} from './schema.js';

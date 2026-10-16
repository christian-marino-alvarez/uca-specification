export enum SignalType {
    STREAM = 'render.stream',
    AREA_RENDERED = 'render.area.rendered',
    ERROR = 'render.error',
}

export enum DataType {
    STREAM_REQUEST = 'StreamRequest',
    RESULT = 'Result',
    ERROR = 'Error',
}

export type {
    Area,
    Body,
    Failure,
    Request,
    Result,
    StreamRequest,
} from './schema.js';

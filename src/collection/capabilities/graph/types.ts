import type { Disposition } from '@uca/core/types';
import type { UcaItem } from './schema.js';

export enum SignalType {
    STREAM_DECODED = 'llm-web.stream_decoded',
    UCA_STREAM = 'graph.uca_stream',
    UCA_DETECTED = 'graph.uca_detected',
    ERROR = 'graph.error',
}

export enum DataType {
    STREAM_DECODED_PAYLOAD = 'StreamDecodedPayload',
    UCA_STREAM_PAYLOAD = 'UcaStreamPayload',
    UCA_DETECTED_PAYLOAD = 'UcaDetectedPayload',
    UNKNOWN = 'unknown',
}

export interface StreamDecodedPayload {
    readonly streamId?: string;
    readonly stream: ReadableStream<string>;
    readonly model?: string;
}

export interface UcaStreamPayload {
    readonly streamId?: string;
    readonly stream: ReadableStream<UcaItem>;
}



export interface UcaDetectedPayload {
    readonly id: string;
    readonly disposition: Disposition;
    readonly streamId?: string;
}

export interface Body {
    readonly strict?: boolean;
}

export type { ResponseSchema, ResponseData, UcaItem } from './schema.js';

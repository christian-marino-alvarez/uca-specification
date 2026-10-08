import { SignalType } from './types.js';

export const __ID__: string = 'sse-client';
export const AIM: string = 'Stream HTTP Server-Sent Events messages reactively';
export const DEFAULT_ENDPOINT: string = '/api/llm/sse';

export const DEFAULT_SIGNALS: readonly SignalType[] = [
    SignalType.STREAM,
    SignalType.ABORT,
] as const;

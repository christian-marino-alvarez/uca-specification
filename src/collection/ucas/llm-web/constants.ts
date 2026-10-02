import { SignalType } from './types.js';

export const __ID__ = 'llm-web';

export const DEFAULT_ENDPOINT = '/api/llm';

export const DEFAULT_SSE_ENDPOINT = '/api/llm/sse';

export const DEFAULT_SIGNALS = [
    SignalType.PROMPT,
    SignalType.STREAM,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

import { SignalType } from './types.js';

export const __ID__ = 'llm-web';

export const DEFAULT_ENDPOINT = '/api/llm';

export const DEFAULT_SSE_ENDPOINT = '/api/llm/sse';
export const DEFAULT_USE_REMOTE = true;
export const DEFAULT_PROVIDER = 'gemini';
export const DEFAULT_MODEL = 'gemini-3.7-flash';

export const DEFAULT_SIGNALS = [
    SignalType.PROMPT,
    SignalType.STREAM,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

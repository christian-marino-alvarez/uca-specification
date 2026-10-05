import { SignalType } from './types.js';

export const __ID__ = 'llm-web';

export const DEFAULT_ENDPOINT = '/api/llm';

export const DEFAULT_SSE_ENDPOINT = '/api/llm/sse';
export const DEFAULT_USE_REMOTE = true;
export const DEFAULT_PROVIDER = 'gemini';
export const DEFAULT_MODEL = 'gemini-3.5-flash-lite';
export const DEFAULT_DETERMINISM = 80;
export const DEFAULT_IMAGINATION = 20;
export const DEFAULT_DELIBERATION = 0;
export const DEFAULT_CONCISENESS = 80;
export const DEFAULT_TEMPERATURE = 0.2;

export const DEFAULT_SIGNALS = [
    SignalType.PROMPT,
    SignalType.STREAM,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

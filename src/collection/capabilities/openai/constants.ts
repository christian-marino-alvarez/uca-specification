import { SignalType } from './types.js';

export const __ID__ = 'openai';
export const DEFAULT_MODEL = 'gpt-4o';
export const DEFAULT_TEMPERATURE = 0.7;
export const DEFAULT_MAX_OUTPUT_TOKENS = 4096;

export const DEFAULT_SIGNALS: readonly string[] = [
    SignalType.CONNECT,
    SignalType.GENERATE,
    SignalType.STREAM,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

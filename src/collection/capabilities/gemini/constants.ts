import { SignalType, ThinkingLevel } from './types.js';

export const __ID__ = 'gemini';
export const DEFAULT_MODEL = 'gemini-3.7-flash';
export const DEFAULT_TEMPERATURE = 1;
export const DEFAULT_MAX_OUTPUT_TOKENS = 4096;
export const DEFAULT_THINKING_BUDGET = 0;
export const DEFAULT_THINKING_LEVEL = ThinkingLevel.LOW;
export const THINKING_LEVEL_MODEL_PREFIX = 'gemini-3';

export const DEFAULT_SIGNALS: readonly string[] = [
    SignalType.CONNECT,
    SignalType.GENERATE,
    SignalType.STREAM,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;


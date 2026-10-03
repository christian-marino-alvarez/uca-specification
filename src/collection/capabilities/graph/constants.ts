import { SignalType } from './types.js';
import { getCommunicationJsonSchema } from './schema.js';

export const __ID__ = 'graph';
export const AIM = 'Validate LLM graph response and dispatch dispositions to UCAs';

export const DEFAULT_SIGNALS = [
    SignalType.RESOLVE,
    SignalType.CHUNK,
    SignalType.CHUNK_PROMPT_API,
    SignalType.COMPLETED,
    SignalType.STREAM_END_PROMPT_API,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

export const COMMUNICATION_SCHEMA = getCommunicationJsonSchema();

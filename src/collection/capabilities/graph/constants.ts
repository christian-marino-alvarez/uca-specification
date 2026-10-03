import { SignalType } from './types.js';
import { getCommunicationJsonSchema } from './schema.js';

export const __ID__ = 'graph';
export const AIM = 'Validate LLM graph response and dispatch dispositions to UCAs';

export const DEFAULT_SIGNALS = [
    SignalType.STREAM_DECODED,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

export const COMMUNICATION_SCHEMA = getCommunicationJsonSchema();

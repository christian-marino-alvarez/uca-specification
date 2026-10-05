import { SignalType } from './types.js';
import { getCommunicationJsonSchema } from './schemas/index.js';

export const __ID__ = 'graph';
export const AIM = 'Parse streaming text against a schema to detect and emit structured graph nodes in real time';

export const DEFAULT_SIGNALS = [
    SignalType.STREAM_DECODED,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

export const COMMUNICATION_SCHEMA = getCommunicationJsonSchema();


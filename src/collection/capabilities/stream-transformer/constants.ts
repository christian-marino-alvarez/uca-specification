import { SignalType } from './types.js';

export const __ID__ = 'stream-transformer';

export const AIM = 'Transform incoming text stream into a validated object chunk stream';

export const DEFAULT_SIGNALS: readonly string[] = [
    SignalType.TRANSFORM,
];

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

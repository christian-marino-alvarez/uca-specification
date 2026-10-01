export const __ID__ = 'llm';

export const DEFAULT_SIGNALS: readonly string[] = [
    'llm.infer',
    'llm.connect',
    'jev.connected',
    'jev.inferred',
    'jev.error',
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;


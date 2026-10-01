export const __ID__ = 'app';

export const DEFAULT_SIGNALS: readonly string[] = [
    'app.init',
    'app.start',
    'app.stop',
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

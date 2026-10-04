import { SignalType } from './types.js';

export const __ID__ = 'server';

export const DEFAULT_PORT = 3000;

export const DEFAULT_HOSTNAME = 'localhost';

export const DEFAULT_AUTO_START = true;

export const DEFAULT_DIST_DIR = 'dist';

export const DEFAULT_WEB_DIR = 'dist/web';

export const DEFAULT_SIGNALS = [
    SignalType.START,
    SignalType.STOP,
    SignalType.ROUTE,
    SignalType.RESPOND,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

export const DEFAULT_TEMPERATURE = 1;

export const DEFAULT_MAX_OUTPUT_TOKENS = 4096;


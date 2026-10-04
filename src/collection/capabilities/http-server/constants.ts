import { SignalType } from './types.js';

export const __ID__ = 'http-server';

export const AIM = 'Serve HTTP endpoints and routes using lightweight Hono engine';

export const DEFAULT_PORT = 3000;

export const DEFAULT_HOSTNAME = 'localhost';

export const DEFAULT_TIMEOUT_MS = 5000;

export const DEFAULT_SIGNALS = [
    SignalType.LISTEN,
    SignalType.CLOSE,
    SignalType.ROUTE,
    SignalType.RESPOND,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

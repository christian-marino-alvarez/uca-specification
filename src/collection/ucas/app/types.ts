import type { z } from 'zod';
import type { bodySchema } from './schema.js';

export enum SignalType {
    INIT = 'app.init',
    START = 'app.start',
    STOP = 'app.stop',
    STARTED = 'app.started',
    STOPPED = 'app.stopped',
    CONTEXT = 'app.context',
    CHUNK = 'app.chunk',
    CREATED = 'app.created',
    THEME_CREATED = 'app.theme_created',
    ERROR = 'app.error',
    TRIGGER = 'action.triggered',
}

export type Body = z.infer<typeof bodySchema>;

export enum DataType {
    RECORD = 'record',
    VOID = 'void',
    RESULT = 'result',
    PAYLOAD = 'payload',
}

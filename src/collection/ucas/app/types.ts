import type { Disposition } from '@uca/core/types';

export enum SignalType {
    INIT = 'app.init',
    START = 'app.start',
    STOP = 'app.stop',
    READY = 'app.ready',
    STARTED = 'app.started',
    STOPPED = 'app.stopped',
    ERROR = 'app.error',
    VIEW_COMPOSED = 'app.view.composed',
}

export enum DataType {
    VOID = 'void',
    STRING = 'string',
    BOOLEAN = 'boolean',
    VIEW_DISPOSITION = 'ViewDisposition',
    COMPOSED_RESULT = 'ComposedResult',
}

export interface Body {
    readonly title?: string;
    readonly version?: string;
    readonly active?: boolean;
    readonly request?: string;
    readonly initialView?: Record<string, Disposition>;
}

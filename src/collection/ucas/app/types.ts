export enum SignalType {
    INIT = 'app.init',
    START = 'app.start',
    STOP = 'app.stop',
    READY = 'app.ready',
    STARTED = 'app.started',
    STOPPED = 'app.stopped',
    ERROR = 'app.error',
}

export interface Body {
    readonly title?: string;
    readonly version?: string;
    readonly active?: boolean;
}

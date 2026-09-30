import type { Signal } from '../../../core/types.js';

export enum SignalType {
    LOG = 'logger.log',
    CLEAR = 'logger.clear',
}

export type LogFilter = (signal: Signal) => boolean;

export interface LogEntry {
    readonly timestamp: number;
    readonly source: string;
    readonly property: string;
    readonly value: unknown;
}

export interface Body {
    readonly prefix?: string;
    readonly filter?: LogFilter;
    readonly onLog?: (entry: LogEntry) => void;
}

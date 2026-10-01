import type { Signal } from '@uca/core/types';

export enum SignalType {
    LOG = 'logger.log',
    CLEAR = 'logger.clear',
}

export enum DataType {
    SIGNAL = 'Signal',
    LOG_ENTRY = 'LogEntry',
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

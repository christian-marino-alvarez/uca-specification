import type { Context } from './schema.js';
import type {
    EntityKind,
    Signal,
} from '@uca/core/types';

export enum Scope {
    FRONT = 'front',
    BACKEND = 'backend',
}

export enum SignalType {
    OBSERVE = '*',
    LOG = 'logger.log',
    CLEAR = 'logger.clear',
}

export enum DataType {
    SIGNAL = 'Signal',
    LOG_ENTRY = 'LogEntry',
}

export type LogFilter = (signal: Signal) => boolean;

export interface LogEntry extends Context {
    readonly scope: Scope;
    readonly timestamp: number;
    readonly source: string;
    readonly sourceKind: EntityKind;
    readonly targetId?: string;
    readonly property: string;
    readonly value: unknown;
}

export type LogCallback = (entry: LogEntry) => void;
export type { Body } from './schema.js';

export type { Context } from './schema.js';
export interface ObservedPayload extends Context {
    readonly state?: Context;
    readonly area?: Context;
    readonly value?: Context;
    readonly result?: ObservedResult;
}

export interface ObservedResult {
    readonly selectedId?: string;
    readonly context?: ObservedDecisionContext;
    readonly continuation?: Context;
}

export interface ObservedDecisionContext {
    readonly area?: {
        readonly id?: string;
        readonly aim?: string;
    };
}

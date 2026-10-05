export enum SignalType {
    CREATE = 'app.create',
    UPDATE = 'app.update',
    REMOVE = 'app.remove',
    EXPLAIN = 'app.explain',
    CREATED = 'app.created',
    UPDATED = 'app.updated',
    REMOVED = 'app.removed',
    METRICS = 'app.metrics',
}

export enum DataType {
    VOID = 'void',
    RECORD = 'record',
    STRING = 'string',
    METRICS = 'metrics',
    STREAM = 'stream',
}

export type { Body, PerformanceMetrics } from './schema.js';

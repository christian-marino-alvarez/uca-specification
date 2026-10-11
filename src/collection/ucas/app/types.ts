export { type Body, bodySchema } from './schema.js';

export enum SignalType {
    ERROR = 'app.error',
}

export enum DataType {
    BODY = 'body',
    VOID = 'void',
    UNKNOWN = 'unknown',
}

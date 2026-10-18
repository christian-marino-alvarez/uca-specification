export {
    type Body,
    type RoutePayload,
    type RouteState,
} from './schema.js';

export enum SignalType {
    PUSH = 'history.push',
    REPLACE = 'history.replace',
    READ = 'history.read',
    CHANGED = 'history.changed',
    CURRENT = 'history.current',
}

export enum DataType {
    ROUTE_PAYLOAD = 'RoutePayload',
    ROUTE_STATE = 'RouteState',
    VOID = 'void',
}

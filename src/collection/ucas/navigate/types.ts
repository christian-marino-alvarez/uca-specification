export {
    type Body,
    type NavigateRequest,
    type NavigationState,
    type RouteParameter,
} from './schema.js';

export enum SignalType {
    GO = 'navigate.go',
    RESTORE = 'navigate.restore',
    CHANGED = 'navigate.changed',
    RESTORED = 'navigate.restored',
    ERROR = 'navigate.error',
}

export enum DataType {
    NAVIGATE_REQUEST = 'NavigateRequest',
    NAVIGATION_STATE = 'NavigationState',
    VOID = 'void',
    ERROR = 'Error',
}

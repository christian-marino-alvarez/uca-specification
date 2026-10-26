export {
    type Body,
    type NavigateDestroy,
    type NavigateInit,
    type NavigateRequest,
    type NavigationEntry,
    type NavigationState,
    type RouteParameter,
} from './schema.js';

export enum SignalType {
    INIT = 'navigate.init',
    GO = 'navigate.go',
    CHANGED = 'navigate.changed',
    DESTROY = 'navigate.destroy',
}

export enum DataType {
    NAVIGATE_INIT = 'NavigateInit',
    NAVIGATE_REQUEST = 'NavigateRequest',
    NAVIGATE_DESTROY = 'NavigateDestroy',
    NAVIGATION_ENTRY = 'NavigationEntry',
    NAVIGATION_STATE = 'NavigationState',
    VOID = 'void',
}

export type {
    Body,
    BrowserContext,
    DecisionResult,
    Navigation,
    NavigationParameter,
} from './schema.js';

export enum SignalType {
    NAVIGATE = 'app.navigate',
    BROWSER_CHANGED = 'app.browser_changed',
    DECIDED = 'app.decided',
    ERROR = 'app.error',
    SESSION_RESUME = 'app.session_resume',
    SESSION_FRESH = 'app.session_fresh',
}

export enum DataType {
    BODY = 'Body',
    NAVIGATION = 'Navigation',
    BROWSER_CONTEXT = 'BrowserContext',
    DECISION_RESULT = 'DecisionResult',
    ERROR = 'Error',
    VOID = 'void',
}

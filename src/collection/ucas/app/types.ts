export type {
    Body,
    BrowserContext,
    DecisionResult,
    Navigation,
    NavigationParameter,
    Run,
    Session,
} from './schema.js';

export enum SignalType {
    CREATED = 'app.created',
    RUN = 'app.run',
    NAVIGATE = 'app.navigate',
    BROWSER_CHANGED = 'app.browser_changed',
    DECIDED = 'app.decided',
    BUILT = 'app.built',
    ERROR = 'app.error',
}

export enum DataType {
    BODY = 'Body',
    RUN = 'Run',
    NAVIGATION = 'Navigation',
    BROWSER_CONTEXT = 'BrowserContext',
    DECISION_RESULT = 'DecisionResult',
    BUILT_RESULT = 'BuiltResult',
    ERROR = 'Error',
    VOID = 'void',
}

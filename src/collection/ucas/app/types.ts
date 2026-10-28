export type {
  Body,
  BrowserContext,
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
  ERROR = 'app.error',
}

export enum DataType {
  BODY = 'Body',
  RUN = 'Run',
  NAVIGATION = 'Navigation',
  BROWSER_CONTEXT = 'BrowserContext',
  ERROR = 'Error',
  COMPOSE_REQUEST = 'ComposeRequest',
  VOID = 'void',
}

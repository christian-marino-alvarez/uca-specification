export enum SignalType {
    CONFIGURE = 'connection.configure',
    CONNECTED = 'connection.connected',
    ERROR = 'connection.error',
}

export enum DataType {
    CONFIGURATION = 'Configuration',
    RESULT = 'Result',
    ERROR = 'Error',
}

export type {
    Body,
    Configuration,
    Route,
} from './schema.js';


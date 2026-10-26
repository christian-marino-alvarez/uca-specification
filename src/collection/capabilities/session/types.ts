export {
    type Body,
    type Session,
    type SessionPayload,
    type SessionRequest,
    type SessionValue,
} from './schema.js';

export enum StorageType {
    SESSION_STORAGE = 'sessionStorage',
    LOCAL_STORAGE = 'localStorage',
    INDEXED_DB = 'indexedDb',
    DB = 'DB',
}

export enum SignalType {
    GET = 'session.get',
    CREATE = 'session.create',
    DESTROY = 'session.destroy',
    RETRIEVED = 'session.retrieved',
    CREATED = 'session.created',
    DELETED = 'session.deleted',
}

export enum DataType {
    SESSION = 'Session',
    SESSION_PAYLOAD = 'SessionPayload',
    SESSION_REQUEST = 'SessionRequest',
}

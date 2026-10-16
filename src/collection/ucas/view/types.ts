export enum Name {
    ACTION = 'Action',
    BOX = 'Box',
    COLLECTION = 'Collection',
    DROPDOWN = 'Dropdown',
    INPUT = 'Input',
    INTERACTION = 'Interaction',
    OPTIONS = 'Options',
    PICTURE = 'Picture',
}

export enum Kind {
    VISUAL = 'visual',
    LOGIC = 'logic',
    CONNECTION = 'connection',
}

export enum SignalType {
    CREATE = 'view.create',
    ELEMENT_CREATED = 'view.element.created',
    COMPLETED = 'view.completed',
    ERROR = 'view.error',
}

export enum CapabilitySource {
    ACTION = 'action',
    BOX = 'box',
    COLLECTION = 'collection',
    DROPDOWN = 'dropdown',
    INPUT = 'input',
    OPTIONS = 'options',
    PICTURE = 'picture',
    SKELETON = 'skeleton',
    SSE_CLIENT = 'sse-client',
    STREAM_TRANSFORMER = 'stream-transformer',
}

export enum ComponentSignalType {
    CREATED = 'created',
}

export enum DataType {
    REQUEST = 'Request',
    ELEMENT_RESULT = 'ElementResult',
    COMPLETED_RESULT = 'CompletedResult',
    ERROR = 'Error',
}

export type {
    Body,
    Completed,
    ComponentContext,
    ComponentSignal,
    Composition,
    Connection,
    Context,
    Element,
    Entry,
    Failure,
    Logic,
    Request,
    Requirements,
    Result,
} from './schema.js';

export type {
    Body,
    CorePrinciple,
    FormalEntity,
    FormalRelation,
    ParsePayload,
    SpecificationModel,
    SpecificationSection,
} from './schema.js';

export enum SignalType {
    LOAD = 'specification.load',
    PARSE = 'specification.parse',
    PARSED = 'specification.parsed',
    GET = 'specification.get',
    PROVIDED = 'specification.provided',
    ERROR = 'specification.error',
}

export enum DataType {
    BODY = 'Body',
    PARSE_PAYLOAD = 'ParsePayload',
    SPECIFICATION_MODEL = 'SpecificationModel',
    ERROR = 'Error',
    VOID = 'void',
}

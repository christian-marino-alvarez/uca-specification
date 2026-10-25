export type {
    Audience,
    Body,
    DomainEntity,
    ExperienceScenario,
    FunctionalDesign,
    GraphicDesign,
    InformationDisposition,
    QueryRequest,
    SpecificationData,
    SpecificationModel,
    UserExperience,
} from './schema.js';

export enum SignalType {
    QUERY = 'specification.query',
    PROVIDED = 'specification.provided',
    ERROR = 'specification.error',
}

export enum DataType {
    BODY = 'Body',
    QUERY_REQUEST = 'QueryRequest',
    SPECIFICATION_MODEL = 'SpecificationModel',
    SPECIFICATION_DATA = 'SpecificationData',
    ERROR = 'Error',
    VOID = 'void',
}

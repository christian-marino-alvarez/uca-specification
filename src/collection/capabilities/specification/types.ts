export type {
  Audience,
  Body,
  QueryRequest,
  SpecificationModel,
  VisualDispositions,
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
  ERROR = 'Error',
  VOID = 'void',
}

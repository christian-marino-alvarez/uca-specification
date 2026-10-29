export enum SignalType {
  QUERY = 'material.query',
  PROVIDED = 'material.provided',
  ERROR = 'material.error',
}

export enum DataType {
  QUERY_REQUEST = 'QueryRequest',
  MATERIAL_MODEL = 'MaterialModel',
  BODY = 'Body',
  ERROR = 'Error',
}

export type {
  Body,
  CanonicalLayouts,
  Dimensions,
  MaterialModel,
  QueryRequest,
  SpatialPrinciples,
  WindowSizeClass,
  WindowSizeRule,
} from './schema.js';

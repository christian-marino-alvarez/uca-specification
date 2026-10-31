export enum SignalType {
  QUERY = 'material.query',
  PROVIDED = 'material.provided',
  RESOLVE = 'material.resolve',
  RESOLVED = 'material.resolved',
  ERROR = 'material.error',
}

export enum DataType {
  QUERY_REQUEST = 'QueryRequest',
  MATERIAL_MODEL = 'MaterialModel',
  RESOLVE_REQUEST = 'ResolveRequest',
  RESOLVED_QUALITIES = 'ResolvedQualities',
  BODY = 'Body',
  ERROR = 'Error',
}

export type {
  Body,
  CanonicalLayouts,
  ComponentKind,
  Dimensions,
  MaterialModel,
  QueryRequest,
  ResolvedQualities,
  ResolveRequest,
  SpatialPrinciples,
  WindowSizeClass,
  WindowSizeRule,
} from './schema.js';

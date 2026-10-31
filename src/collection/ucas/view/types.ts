export type {
  Area,
  Body,
  BuiltResult,
  Component,
  ComponentType,
  Composition,
  LogicUcaDescriptor,
  PortSummary,
  Qualities,
  Specification,
  WebUcaDescriptor,
} from './schema.js';

export enum SignalType {
  BUILD = 'view.build',
  BUILT = 'view.built',
  ERROR = 'view.error',
}

export enum DataType {
  BODY = 'Body',
  BUILT_RESULT = 'BuiltResult',
  ERROR = 'Error',
}

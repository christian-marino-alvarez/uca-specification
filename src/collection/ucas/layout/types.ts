export type {
  Area,
  AreaCreated,
  Body,
  BuiltResult,
  Composition,
  ContainerArea,
  Qualities,
} from './schema.js';

export enum SignalType {
  BUILD = 'layout.build',
  BUILT = 'layout.built',
  AREA_CREATED = 'layout.area-created',
  ERROR = 'layout.error',
}

export enum DataType {
  BODY = 'Body',
  BUILT_RESULT = 'BuiltResult',
  AREA_CREATED = 'AreaCreated',
  ERROR = 'Error',
}

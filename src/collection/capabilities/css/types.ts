import type { Qualities } from './schema.js';

export enum SignalType {
  MOUNT = 'style.mount',
  RESOLVE = 'style.resolve',
  APPLY = 'style.apply',
  REMOVE = 'style.remove',
  MOUNTED = 'style.mounted',
  RESOLVED = 'style.resolved',
  APPLIED = 'style.applied',
  REMOVED = 'style.removed',
  ERROR = 'style.error',
}

export enum DataType {
  BODY = 'Body',
  MOUNT_PAYLOAD = 'MountPayload',
  RESOLVE_PAYLOAD = 'ResolvePayload',
  APPLY_PAYLOAD = 'ApplyPayload',
  REMOVE_PAYLOAD = 'RemovePayload',
  MOUNTED_RESULT = 'MountedResult',
  RESOLVED_RESULT = 'ResolvedResult',
  APPLIED_RESULT = 'AppliedResult',
  REMOVED_RESULT = 'RemovedResult',
  ERROR = 'Error',
}

export enum ControlType {
  INPUT = 'input',
  ACTION = 'action',
}

export interface DesignToken<T = string> {
  readonly $value: T;
  readonly $type?: string;
  readonly $description?: string;
}

export type PropertyMapping = readonly [
  quality: keyof Qualities,
  group: string,
  property: string,
];

export type {
  AppliedResult,
  ApplyPayload,
  Body,
  ErrorResult,
  MountedResult,
  MountPayload,
  Qualities,
  RemovedResult,
  RemovePayload,
  ResolvedResult,
  ResolvePayload,
} from './schema.js';

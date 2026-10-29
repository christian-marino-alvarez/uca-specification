export enum SignalType {
  MOUNT = 'skeleton.mount',
  SHOW = 'skeleton.show',
  REMOVE = 'skeleton.remove',
  MOUNTED = 'skeleton.mounted',
  SHOWN = 'skeleton.shown',
  REMOVED = 'skeleton.removed',
  ERROR = 'skeleton.error',
}

export enum DataType {
  BODY = 'Body',
  MOUNT_PAYLOAD = 'MountPayload',
  SHOW_PAYLOAD = 'ShowPayload',
  REMOVE_PAYLOAD = 'RemovePayload',
  MOUNTED_RESULT = 'MountedResult',
  SHOWN_RESULT = 'ShownResult',
  REMOVED_RESULT = 'RemovedResult',
  ERROR_RESULT = 'ErrorResult',
}

export type {
  Body,
  ErrorResult,
  MountedResult,
  MountPayload,
  RemovedResult,
  RemovePayload,
  ShownResult,
  ShowPayload,
} from './schema.js';

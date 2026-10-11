import { SignalType } from './types.js';
import { SignalType as WebComponentSignalType } from '@uca/capability-web-component/types';

export const __ID__ = 'box';

export const DEFAULT_SIGNALS: readonly string[] = [
    SignalType.RENDER,
    SignalType.UPDATE,
    SignalType.REMOVE,
    WebComponentSignalType.RENDERED,
    WebComponentSignalType.UPDATED,
    WebComponentSignalType.REMOVED,
    WebComponentSignalType.EVENT,
] as const;

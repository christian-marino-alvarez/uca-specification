import { SignalType as LocalStorageSignalType } from '@uca/capability-local-storage/types';
import { SignalType as ScaffoldSignalType } from '@uca/scaffold/types';
import { SignalType } from './types.js';

export const __ID__ = 'header';

export const DEFAULT_GOAL = 'Emerge 2 to 4 distinct flat child spaces (e.g. identity, navigation). Every space has parentTo: "header". Never name a space "header".';

export const DEFAULT_MODEL = 'local';

export const DEFAULT_SIGNALS: readonly string[] = [
    SignalType.CREATE,
    SignalType.STREAM,
    SignalType.DESTROY,
    ScaffoldSignalType.CHUNK,
    ScaffoldSignalType.STREAMED,
    ScaffoldSignalType.CREATED,
    ScaffoldSignalType.ERROR,
    LocalStorageSignalType.RETRIEVED,
];

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

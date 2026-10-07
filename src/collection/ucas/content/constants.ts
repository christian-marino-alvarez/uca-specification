import { SignalType as LocalStorageSignalType } from '@uca/capability-local-storage/types';
import { SignalType as ScaffoldSignalType } from '@uca/scaffold/types';
import { SignalType } from './types.js';

export const __ID__ = 'content';

export const DEFAULT_GOAL = 'Infer and design strictly the essential layout disposition spaces required by its purpose as the main website content (e.g. heroBanner, ucaCoreExplainer, reactiveSignalsDemo, capabilityGrid). Parent is contentSection.';

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

import { SignalType as LocalStorageSignalType } from '@uca/capability-local-storage/types';
import { SignalType as ScaffoldSignalType } from '@uca/scaffold/types';
import { SignalType } from './types.js';

export const __ID__ = 'footer';

export const DEFAULT_GOAL = 'Infer and design strictly the essential, minimal layout disposition spaces required by its purpose as a website footer (e.g. copyrightNotice, legalLinks, socialRow). Parent is footerSection.';

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

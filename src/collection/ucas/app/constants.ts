import { SignalType as ScaffoldComposerSignalType } from '@uca/scaffold-composer/types';
import { SignalType } from './types.js';

export const __ID__ = 'app';

export const DEFAULT_SIGNALS = [
    SignalType.CREATE,
    ScaffoldComposerSignalType.CREATED,
    ScaffoldComposerSignalType.STREAM,
    ScaffoldComposerSignalType.UPDATED,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

import { DispositionSignal } from '@uca/core/types';
import { SignalType as SessionSignalType } from '@uca/capability-session/types';

export const __ID__ = 'telemetry';

export const DEFAULT_AIM =
    'Detect, trace, and log session and app lifecycle signals across the reactive bus';

export const INTERCEPTED_SIGNALS = [
    '*',
] as const;

export const DEFAULT_FILTER = [
    DispositionSignal.INNERVATED,
    DispositionSignal.DENERVATED,
    SessionSignalType.GET,
    SessionSignalType.RETRIEVED,
    SessionSignalType.CREATE,
    SessionSignalType.CREATED,
] as const;


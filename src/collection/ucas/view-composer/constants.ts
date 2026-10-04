import { SignalType } from './types.js';

export const __ID__ = 'view-composer';

export const PURPOSE = 'Coordinate and encapsulate view composition and layout scaffolding';

export const DEFAULT_THINKING_BUDGET = 0;

export const DEFAULT_SIGNALS: readonly string[] = [
    SignalType.CREATE,
    SignalType.UPDATE,
    SignalType.REMOVE,
];

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

import { SignalType as LlmWebSignalType } from '@uca/llm-web/types';
import { SignalType as GraphSignalType } from '@uca/capability-graph/types';
import { SignalType, type Scaffold } from './types.js';

export const __ID__ = 'scaffold-composer';

export const DEFAULT_DETERMINISM = 90;

export const DEFAULT_IMAGINATION = 10;

export const DEFAULT_DELIBERATION = 0;

export const DEFAULT_CONCISENESS = 85;

export const DEFAULT_SIGNALS: readonly string[] = [
    SignalType.CREATE,
    SignalType.UPDATE,
    SignalType.REMOVE,
    GraphSignalType.STREAM,
    LlmWebSignalType.RESPONSE,
    LlmWebSignalType.ERROR,
];

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

export const DEFAULT_SCAFFOLD: Scaffold = {
    purpose: '',
    regions: {},
    ucas: {},
    theme: {
        global: '',
    },
};


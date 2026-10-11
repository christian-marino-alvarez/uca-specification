import { type ExpectedInput, type ExpectedOutput, SignalType } from './types.js';

export const __ID__ = 'api-prompt';

export const AIM = 'Provide browser-level prompt execution and streaming inference capabilities';

export const DEFAULT_MODEL = 'default';

export const DEFAULT_EXPECTED_INPUTS: readonly ExpectedInput[] = [
    { type: 'text', languages: ['en'] },
];

export const DEFAULT_EXPECTED_OUTPUTS: readonly ExpectedOutput[] = [
    { type: 'text', languages: ['en'] },
];

export const DEFAULT_PERSISTENT_SESSION = false;

export const DEFAULT_AUTO_LOAD = false;

export const DEFAULT_TEMPERATURE = 0.1;

export const DEFAULT_TOP_K = 1;

export const DEFAULT_WARMUP_PROMPT = '1';

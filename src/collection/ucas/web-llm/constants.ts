import { SignalType as ApiPromptSignalType } from '@uca/capability-api-prompt/types';
import { SignalType } from './types.js';

export const __ID__ = 'web-llm';

export const DEFAULT_MODEL = 'local';

export const DEFAULT_LOCAL_PROVIDER = 'gemini-nano';

export const DEFAULT_NUBE_PROVIDER = 'gemini';

export const DEFAULT_ENDPOINT = '/api/llm/sse';

export const DEFAULT_IMAGINATION = 5;

export const DEFAULT_MAX_TOKENS = 1024;

export const DEFAULT_SIGNALS: readonly string[] = [
    SignalType.CREATE,
    SignalType.STREAM,
    SignalType.DESTROY,
    ApiPromptSignalType.READY,
    ApiPromptSignalType.STREAMED,
    ApiPromptSignalType.ERROR,
];

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

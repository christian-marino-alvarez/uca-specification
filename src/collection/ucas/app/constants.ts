import { SignalType as ApiPromptSignalType } from '@uca/capability-api-prompt/types';
import { SignalType as WebLlmSignalType } from '@uca/web-llm/types';
import { SignalType as ContentSignalType } from '@uca/content/types';
import { SignalType as FooterSignalType } from '@uca/footer/types';
import { SignalType as ActionSignalType } from '@uca/action/types';
import { SignalType } from './types.js';

export const __ID__ = 'app';

export const DEFAULT_GOAL = 'Descubrir y articular la arquitectura cognitiva universal y sus conceptos clave';

export const DEFAULT_SIGNALS: readonly string[] = [
    SignalType.CREATE,
    SignalType.STREAM,
    SignalType.DESTROY,
    ApiPromptSignalType.DOWNLOADING,
    WebLlmSignalType.READY,
    ActionSignalType.TRIGGERED,
    ContentSignalType.CHUNK,
    ContentSignalType.STREAMED,
    ContentSignalType.CREATED,
    ContentSignalType.ERROR,
    FooterSignalType.CHUNK,
    FooterSignalType.STREAMED,
    FooterSignalType.CREATED,
    FooterSignalType.ERROR,
];

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

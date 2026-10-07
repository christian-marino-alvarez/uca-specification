import { SignalType as WebLlmSignalType } from '@uca/web-llm/types';
import { SignalType as StreamTransformerSignalType } from '@uca/capability-stream-transformer/types';
import { SignalType } from './types.js';

export const __ID__ = 'scaffold';

export const DEFAULT_GOAL = 'Emerge only the essential flat child layout spaces strictly required to fulfill this purpose';

export const DEFAULT_MODEL = 'local';

export const DEFAULT_IMAGINATION = 1;

export const SCAFFOLD_INSTRUCTION_PREFIX = 'Format: Flat compact NDJSON, one child per line. Schema:';

export const SCAFFOLD_RESTRICTIONS = 'Restrictions: Only emit child spaces with parentTo. Never emit standalone parentTo or root wrappers. Stop when purpose is covered.';

export const DEFAULT_SIGNALS: readonly string[] = [
    SignalType.CREATE,
    SignalType.STREAM,
    SignalType.DESTROY,
    WebLlmSignalType.STREAMED,
    StreamTransformerSignalType.TRANSFORMED,
    WebLlmSignalType.ERROR,
    StreamTransformerSignalType.ERROR,
];

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

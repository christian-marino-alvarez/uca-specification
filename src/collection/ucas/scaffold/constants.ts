import { SignalType as WebLlmSignalType } from '@uca/web-llm/types';
import { SignalType as StreamTransformerSignalType } from '@uca/capability-stream-transformer/types';
import { SignalType } from './types.js';

export const __ID__ = 'scaffold';

export const DEFAULT_GOAL = 'Create a key-value schema of camelCase ucaName and purpose with parentTo representing web disposition layout spaces';

export const DEFAULT_MODEL = 'local';

export const DEFAULT_IMAGINATION = 1;

export const SCAFFOLD_SCHEMA_TEMPLATE = '{"<ucaName>":{"purpose":"<under 4 words>","parentTo":"<parent|null>"}}';

export const SCAFFOLD_NDJSON_INSTRUCTION = 'Format: Strict compact single-line NDJSON without spaces or linebreaks. Flat schema: {"<ucaName>":{"purpose":"...","parentTo":"<parentId|null>"}}. Never nest children or objects.';

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

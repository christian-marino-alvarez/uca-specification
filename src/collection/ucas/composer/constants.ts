import { SignalType as SseSignalType } from '@uca/capability-sse-client/types';
import { SignalType as TransformerSignalType } from '@uca/capability-stream-transformer/types';
import { DataType, SignalType } from './types.js';

export const __ID__ = 'composer';
export const DEFAULT_PARENT = 'app';
export const DEFAULT_GOAL = 'Determine the immediate children needed to satisfy the host purpose';
export const DEFAULT_IMAGINATION = 1;
export const OUTPUT_FORMAT = 'NDJSON: one JSON object per line: {"id": "app:child-name", "purpose": "...", "context": "...", "parentTo": "app", "dimensions": {"width": "75%", "height": "full"}}. Dimensions can be percentages (e.g. 20%, 75%), semantic tokens (narrow, quarter, half, two-thirds, full, auto) or pixels.';
export const RESTRICTIONS = 'The host canvas is a 100% width x 100% height spatial surface partitioned by its immediate children. Spatial conservation rule: sibling regions in the same horizontal row must partition the width to sum exactly 100% (e.g. narrow + quarter + two-thirds, or 20% + 80%). Never assign full width to a region that shares horizontal space with siblings. Only assign full width to full-row headers or footers. Never emit the host itself or descendants. Assign clean spatial dimensions {width, height}, no CSS or HTML boilerplate.';

export const DEFAULT_SIGNALS: readonly string[] = [
    SignalType.CREATE, SignalType.UPDATE, SignalType.STREAM, SignalType.DESTROY,
    SseSignalType.STREAMED, SseSignalType.ERROR,
    TransformerSignalType.TRANSFORMED, TransformerSignalType.ERROR,
] as const;

export const INPUTS = [
    { signal: SignalType.CREATE, type: DataType.PAYLOAD, description: 'Determine the complete immediate composition' },
    { signal: SignalType.UPDATE, type: DataType.PAYLOAD, description: 'Reconsider composition for the current context' },
    { signal: SignalType.STREAM, type: DataType.PAYLOAD, description: 'Stream immediate child declarations' },
    { signal: SignalType.DESTROY, type: DataType.VOID, description: 'Cancel composition reasoning' },
] as const;

export const OUTPUTS = [
    { signal: SignalType.CREATED, type: DataType.RESULT, description: 'New complete composition replacing the previous proposal' },
    { signal: SignalType.STREAMED, type: DataType.STREAM, description: 'Validated child declaration stream' },
    { signal: SignalType.CHUNK, type: DataType.RESULT, description: 'Immediate child declaration' },
    { signal: SignalType.DESTROYED, type: DataType.RESULT, description: 'Cancellation requested' },
    { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Composition failed' },
] as const;

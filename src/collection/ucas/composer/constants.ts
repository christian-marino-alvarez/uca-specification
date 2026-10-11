import { DataType, SignalType } from './types.js';

export const __ID__ = 'composer';
export const DEFAULT_PARENT = 'app';
export const DEFAULT_GOAL = 'Determine the immediate children needed to satisfy the host purpose';
export const DEFAULT_IMAGINATION = 1;
export const OUTPUT_FORMAT = 'NDJSON: one JSON object per line: {"id": "app:child-name", "purpose": "...", "context": "...", "parentTo": "app", "dimensions": {"width": "full", "height": "full"}}. Dimensions can be percentages (e.g. 20%, 80%), semantic tokens (narrow, quarter, half, two-thirds, full, auto) or pixels.';
export const RESTRICTIONS = 'The host canvas is a spatial surface partitioned by its immediate children, strictly bounded by the limits {width, height} provided. Spatial conservation rule: sibling regions in the same horizontal row must partition the width to sum exactly 100% (e.g. narrow + quarter + two-thirds, or 20% + 80%). Full-row headers or footers (such as a status-bar) must have width: "full" (100%) and height: "auto" or 32px. Never assign full width to a region that shares horizontal space with siblings. Never emit the host itself or descendants. Assign clean spatial dimensions {width, height}, no CSS or HTML boilerplate.';

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

import type { Port } from '@uca/core/types';
import { DataType, SignalType } from './types.js';

export const __ID__ = 'builder';

export const INPUTS: readonly Port[] = [
    { signal: SignalType.BUILD, type: DataType.BUILD_PAYLOAD, description: 'Command to build and visually delimit spatial boundaries' },
    { signal: SignalType.STREAM, type: DataType.STREAM_PAYLOAD, description: 'Stream of spatial layout declarations to build' },
    { signal: SignalType.UPDATE, type: DataType.BUILD_PAYLOAD, description: 'Command to update spatial boundaries or qualities' },
    { signal: SignalType.REMOVE, type: DataType.BUILD_PAYLOAD, description: 'Command to remove spatial boundaries' },
    { signal: SignalType.RESET, type: DataType.BUILD_PAYLOAD, description: 'Deliberate command to reset and clear host boundaries' },
] as const;

export const OUTPUTS: readonly Port[] = [
    { signal: SignalType.BUILT, type: DataType.BUILT_RESULT, description: 'Spatial layout built confirmation' },
    { signal: SignalType.CREATED, type: DataType.CREATED_RESULT, description: 'Builder element created confirmation' },
    { signal: SignalType.UPDATED, type: DataType.UPDATED_RESULT, description: 'Builder element updated confirmation' },
    { signal: SignalType.REMOVED, type: DataType.REMOVED_RESULT, description: 'Builder element removed confirmation' },
    { signal: SignalType.ERROR, type: DataType.ERROR_RESULT, description: 'Builder error notification' },
] as const;

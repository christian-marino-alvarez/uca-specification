import { REPAIR_GOAL } from './constants.js';
import type { InferPayload, RepairContext, RepairFailure } from './types.js';

export const describeFailure = (error: unknown): RepairFailure => {
    if (typeof error === 'string') {
        return { message: error };
    }
    const { message = 'Output validation failed', issues } = (error ?? {}) as RepairFailure;
    return { message, ...(issues !== undefined && { issues }) };
};

export const createRepairRequest = (original: InferPayload, recovery: RepairContext): InferPayload => {
    const { contextSchema, goal: originalGoal, limits } = original;
    const { const: facts } = (contextSchema ?? {}) as Record<string, unknown>;
    const { requestId, value, error, attempt, accepted, acceptedKeys } = recovery;
    const correction = { originalGoal, rejected: value, error: describeFailure(error), attempt, ...(accepted !== undefined && { accepted }), ...(acceptedKeys && { acceptedKeys }) };
    return { ...original, correlationId: requestId, contextSchema: { ...contextSchema, const: { original: facts, correction } }, goal: REPAIR_GOAL, limits: { ...limits, repairOnly: true } };
};

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
    const { context, contextSchema, goal: originalGoal } = original;
    const facts = context ?? ((contextSchema ?? {}) as Record<string, unknown>).const;
    const { requestId, value, error, attempt, accepted, acceptedKeys } = recovery;
    const correction = { originalGoal, rejected: value, error: describeFailure(error), attempt, ...(accepted !== undefined && { accepted }), ...(acceptedKeys && { acceptedKeys }) };
    const originalLimits = ((facts as Record<string, unknown>)?.limits ?? {}) as Record<string, unknown>;
    const resolvedContext = { original: facts, correction, limits: { ...originalLimits, repairOnly: true } };
    const repairedSchema = contextSchema ? { ...contextSchema, const: resolvedContext } : undefined;
    return { ...original, sessionId: requestId, context: resolvedContext, ...(repairedSchema && { contextSchema: repairedSchema }), goal: REPAIR_GOAL };
};

import type { Context, ObservedPayload } from './types.js';

export function extractContext(value: unknown): Context {
    const payload = (value ?? {}) as ObservedPayload;
    const {
        state,
        area,
        value: stored,
        result,
    } = payload;
    const {
        selectedId,
        selectedIds,
        path,
        requiredUcas,
        context,
        continuation,
    } = result ?? {};
    const {
        area: decisionArea,
    } = context ?? {};
    const {
        id: decisionAreaId,
        aim,
    } = decisionArea ?? {};
    const merged = {
        ...stored,
        ...state,
        ...area,
        ...continuation,
        ...payload,
    };
    const {
        areaId: mergedAreaId,
        parentTo,
        compositionId,
        depth,
        correlationId,
    } = merged;
    return {
        areaId: decisionAreaId ?? mergedAreaId,
        parentTo,
        compositionId,
        depth,
        correlationId,
        selectedId,
        selectedIds,
        path,
        requiredUcas,
        aim,
    };
}

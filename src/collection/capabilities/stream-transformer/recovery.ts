import { Mode, type Candidate, type RequestCallback, type RequestFields, type Resolution, type Response } from './types.js';

export async function resolveObject(original: Record<string, unknown>, resolution: Resolution, request: RequestCallback): Promise<Record<string, unknown>> {
    let current: Response = { accepted: false, value: original };
    for (let attempt = 0; ; attempt++) {
        const { value = original, error } = current;
        const result = error !== undefined ? current : validateCandidate({ value, attempt }, resolution);
        if (result.accepted) {
            return result.value as Record<string, unknown>;
        }
        current = await retryCandidate({ value, error: result.error, attempt: attempt + 1 }, resolution, request);
    }
}

async function retryCandidate(fields: RequestFields, resolution: Resolution, request: RequestCallback): Promise<Response> {
    const { attempt, error } = fields;
    const { maxAttempts } = resolution;
    if (attempt > maxAttempts) {
        throw error;
    }
    return await request(fields, resolution);
}

function validateCandidate(candidate: Candidate, resolution: Resolution): Response {
    const { value, attempt } = candidate;
    const { mode, schema, acceptedKeys } = resolution;
    const keys = Object.keys((value ?? {}) as object);
    if (mode === Mode.ENTRIES && ((attempt > 0 && keys.length !== 1) || keys.some((key) => acceptedKeys.includes(key)))) {
        return { accepted: false, error: new Error('A repaired entry must contain one key and cannot replace an accepted identifier') };
    }
    if (!schema) {
        return {
            accepted: true,
            value,
        };
    }
    const result = schema.safeParse(value);
    return result.success
        ? {
            accepted: true,
            value: result.data,
        }
        : {
            accepted: false,
            error: result.error,
        };
}

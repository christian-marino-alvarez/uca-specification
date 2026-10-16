import { SignalType as LlmSignalType } from '@uca/llm/types';
export const __ID__ = 'server';

export const DEFAULT_PORT = 3000;
export const DEFAULT_HOSTNAME = 'localhost';
export const DEFAULT_AUTO_START = true;
export const DEFAULT_DIST_DIR = 'dist';
export const DEFAULT_WEB_DIR = 'dist/web';
export const DEFAULT_TEMPERATURE = 1;
export const DEFAULT_MAX_OUTPUT_TOKENS = 16384;
export const DELIBERATION_BUDGET_SCALE = 2048;

export const normalizeInference = (payload: import('./types.js').InferenceRequest): import('@uca/llm/types').InferPayload => {
    const { correlationId = crypto.randomUUID(), ...request } = payload;
    return { ...request, correlationId };
};

export const SSE_HEADERS = { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache', Connection: 'keep-alive' } as const;
export const STREAM_SOURCE_SIGNALS = [LlmSignalType.STREAMED, LlmSignalType.ERROR] as const;

export const JEV_CONTEXT_INSTRUCTION = 'Evaluate this criterion within the following inference contract. Respect its purpose, goal, context and limits; outputSchema describes the combined answers.';
export const WARMUP_CONTRACT = {
    outputSchema: { type: 'object', properties: { ready: { type: 'boolean' } }, required: ['ready'], additionalProperties: false },
    contextSchema: { const: {} }, purpose: 'Prepare the inference service', goal: 'Confirm readiness', limits: {},
} as const;

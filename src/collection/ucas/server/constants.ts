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
    const { sessionId = crypto.randomUUID(), ...request } = payload;
    return { ...request, sessionId };
};

export const SSE_HEADERS = { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache', Connection: 'keep-alive' } as const;
export const STREAM_SOURCE_SIGNALS = [LlmSignalType.STREAMED, LlmSignalType.ERROR] as const;

export const JEV_CONTEXT_INSTRUCTION = 'Evaluate this criterion within the following inference contract. Respect its purpose, goal and context; outputSchema describes the combined answers.';
export const WARMUP_CONTRACT = {
    outputSchema: { type: 'object', properties: { ready: { type: 'boolean' } }, required: ['ready'], additionalProperties: false },
    context: {},
    purpose: 'Prepare the inference service',
    goal: 'Confirm readiness',
} as const;

export const MIME_MAP: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.ts': 'text/plain; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.md': 'text/markdown; charset=utf-8',
};

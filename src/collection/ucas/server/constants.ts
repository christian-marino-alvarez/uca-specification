import { SignalType as LlmSignalType } from '@uca/llm/types';

export const __ID__ = 'server';

export const DEFAULT_PURPOSE =
  'Orquestar el ciclo de vida del servidor HTTP, los endpoints cognitivos de LLM y el enrutamiento';

export const DEFAULT_PORT = 3000;
export const DEFAULT_HOSTNAME = 'localhost';
export const DEFAULT_AUTO_START = true;
export const DEFAULT_DIST_DIR = 'dist';
export const DEFAULT_WEB_DIR = 'dist/web';
export const DEFAULT_TEMPERATURE = 1;
export const DEFAULT_MAX_OUTPUT_TOKENS = 16384;
export const DELIBERATION_BUDGET_SCALE = 2048;

export const HEALTH_PATH = '/api/health';
export const LLM_PATH = '/api/llm';
export const LLM_SSE_PATH = '/api/llm/sse';
export const WILDCARD_PATH = '*';

export const SSE_HEADERS: Readonly<Record<string, string>> = {
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
} as const;

export const STATIC_CACHE_CONTROL = 'no-cache, no-store, must-revalidate';

export const STREAM_SOURCE_SIGNALS = [
  LlmSignalType.STREAMED,
  LlmSignalType.ERROR,
] as const;

export const JEV_CONTEXT_INSTRUCTION =
  'Evaluar este criterio dentro del siguiente contrato de inferencia. Respetar su propósito, objetivo y contexto; outputSchema describe las respuestas combinadas.';

export const WARMUP_CONTRACT = {
  outputSchema: {
    type: 'object',
    properties: {
      ready: {
        type: 'boolean',
      },
    },
    required: [
      'ready',
    ],
    additionalProperties: false,
  },
  context: {},
  purpose: 'Preparar el servicio de inferencia',
  goal: 'Confirmar disponibilidad',
} as const;

export const MIME_MAP: Readonly<Record<string, string>> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.ts': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.md': 'text/markdown; charset=utf-8',
} as const;

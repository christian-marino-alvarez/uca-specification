import { GoogleGenAI } from '@google/genai';
import {
  DEFAULT_MODEL,
  DEFAULT_THINKING_BUDGET,
  DEFAULT_THINKING_LEVEL,
} from './constants.js';
import type {
  ApiFailure,
  Body,
  Failure,
  GeneratePayload,
  GenerateResult,
  StreamIterator,
  StreamResult,
} from './types.js';

export function createStream(
  iterator: StreamIterator,
  abort: AbortController,
  cleanup: () => void,
): ReadableStream<string> {
  return new ReadableStream<string>({
    pull: (controller) => readNext(iterator, controller, abort, cleanup),
    async cancel(reason) {
      abort.abort(reason);
      cleanup();
      await iterator.return?.();
    },
  }, {
    highWaterMark: 0,
  });
}

async function readNext(
  iterator: StreamIterator,
  controller: ReadableStreamDefaultController<string>,
  abort: AbortController,
  cleanup: () => void,
): Promise<void> {
  try {
    abort.signal.throwIfAborted();
    const {
      done,
      value,
    } = await iterator.next();
    if (done) {
      cleanup();
      controller.close();
    }
    else {
      controller.enqueue(value?.text ?? '');
    }
  }
  catch (error) {
    cleanup();
    controller.error(error);
  }
}

export async function executeGeneration(
  payload: GeneratePayload,
  body: Body = {},
): Promise<GenerateResult> {
  const {
    prompt,
    sessionId,
  } = payload;
  const client = resolveClient(body);
  const {
    config,
    model,
  } = resolveGenerationConfig(payload, body);
  const response = await client.models.generateContent({
    config,
    contents: prompt,
    model,
  });
  return formatResult(response, prompt, model, sessionId);
}

export async function executeStream(
  payload: GeneratePayload,
  body: Body = {},
  sessionId: string,
  controller: AbortController,
  cleanup: () => void,
): Promise<StreamResult> {
  const {
    prompt,
    streamId,
  } = payload;
  const client = resolveClient(body);
  const {
    config,
    model,
  } = resolveGenerationConfig(payload, body);
  const iterator = await client.models.generateContentStream({
    config: { ...config, abortSignal: controller.signal },
    contents: prompt,
    model,
  });
  controller.signal.throwIfAborted();
  const stream = createStream(iterator, controller, cleanup);
  return { sessionId, stream, streamId };
}

export function describeFailure(
  error: unknown,
  payload: GeneratePayload,
  body: Body = {},
): Failure {
  const {
    config,
    model,
  } = resolveGenerationConfig(payload, body);
  const {
    message = String(error),
    status,
  } = error as ApiFailure;
  const configuration = Object.keys(config).join(', ');
  const schemaSize = JSON.stringify(config.responseJsonSchema ?? {}).length;
  const description = `[${status ?? 'unknown'}] ${message} | model: ${model} | config: ${configuration} | schemaSize: ${schemaSize}`;
  return { configuration, error: description, model, schemaSize, sessionId: payload.sessionId, status };
}

function resolveGenerationConfig(
  payload: GeneratePayload,
  body: Body,
): { model: string; config: Record<string, unknown> } {
  const model = payload.model ?? body.model ?? DEFAULT_MODEL;
  const systemInstruction = payload.systemInstruction ?? body.systemInstruction;
  const schema = typeof payload.schema === 'string' ? JSON.parse(payload.schema) : payload.schema;
  const responseMimeType = payload.responseMimeType ?? body.responseMimeType ?? (schema ? 'application/json' : undefined);
  const temperature = payload.temperature ?? body.temperature;
  const maxOutputTokens = payload.maxOutputTokens ?? body.maxOutputTokens;
  const thinkingBudget = payload.thinkingBudget ?? body.thinkingBudget ?? DEFAULT_THINKING_BUDGET;
  const thinkingConfig = model.includes('lite') ? undefined : model.includes('3.5') ? { thinkingLevel: payload.thinkingLevel ?? body.thinkingLevel ?? DEFAULT_THINKING_LEVEL } : { thinkingBudget };
  return { model, config: { ...(systemInstruction && { systemInstruction }), ...(responseMimeType && { responseMimeType }), ...(schema && { responseJsonSchema: schema }), ...(thinkingConfig && { thinkingConfig }), ...(temperature !== undefined && { temperature }), ...(maxOutputTokens !== undefined && { maxOutputTokens }) } };
}

function formatResult(
  response: { text?: string; usageMetadata?: unknown },
  prompt: string,
  model: string,
  sessionId?: string,
): GenerateResult {
  const {
    text = '',
    usageMetadata,
  } = response;
  const usage = usageMetadata as Record<string, unknown> | undefined;
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  }
  catch {
    data = undefined;
  }
  return { data, model, prompt, sessionId, text, usage };
}

function resolveClient(body: Body): GoogleGenAI {
  const {
    client,
    connection,
  } = body;
  const env = typeof process !== 'undefined' ? process.env : undefined;
  const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem('GEMINI_API_KEY') ?? undefined : undefined;
  const apiKey = connection?.apiKey ?? env?.GEMINI_API_KEY ?? env?.GOOGLE_GENAI_API_KEY ?? env?.GOOGLE_API_KEY ?? localKey;
  if (!client && !apiKey) {
    throw new Error('GEMINI_API_KEY no configurada. Define GEMINI_API_KEY en .env');
  }
  sanitizeEnvironment();
  const httpOptions = connection?.baseURL ? { baseUrl: connection.baseURL } : undefined;
  return client ?? new GoogleGenAI({ apiKey, ...(httpOptions && { httpOptions }) });
}

function sanitizeEnvironment(): void {
  if (typeof process !== 'undefined') {
    const credentials = process.env?.GOOGLE_APPLICATION_CREDENTIALS;
    if (credentials?.includes('firebase-tools.json') || credentials?.startsWith('~')) {
      delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }
  }
}

import { Uca } from '@uca/core/uca';
import type {
    Cooky,
    Disposition,
    Signal,
} from '@uca/core/types';
import { HttpClient } from '@uca/capability-http-client';
import {
    SignalType as HttpSignalType,
    type ResponsePayload,
    type ErrorPayload,
} from '@uca/capability-http-client/types';
import { Decision } from '@uca/decision';
import {
    SignalType as DecisionSignalType,
    DataType as DecisionDataType,
    type Result as DecisionResult,
} from '@uca/decision/types';
import { Memory } from '@uca/memory';
import {
    SignalType as MemorySignalType,
    DataType as MemoryDataType,
} from '@uca/memory/types';
import { SseClient } from '@uca/capability-sse-client';
import {
    SignalType as SseSignalType,
    type StreamResult as SseStreamResult,
} from '@uca/capability-sse-client/types';
import { DEFAULT_ENDPOINT as DEFAULT_SSE_ENDPOINT } from '@uca/capability-sse-client/constants';
import { Zod } from '@uca/capability-zod';
import {
    SignalType as ZodSignalType,
    type ValidatedResult,
    type ErrorResult,
} from '@uca/capability-zod/types';
import type { z } from 'zod';
import { inferenceSchema } from './schema.js';
import {
    __ID__,
    AVAILABLE_MODELS,
    DEFAULT_ENDPOINT,
    DEFAULT_GEMINI_FLASH_LITE_MODEL,
    DEFAULT_PROVIDER,
} from './constants.js';
import {
    type Body,
    type InferPayload,
    type InferResult,
    type ProviderType,
    type TransportContext,
    type AbortPayload,
    type ChosenModelConfig,
    type PendingInference,
    type ThinkingLevel,
    DataType,
    SignalType,
} from './types.js';

export class Llm extends Uca<Body> {
    public static override purpose =
        'Request complete cognitive inferences through the application backend';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Llm.purpose,
            body: {},
        },
        reactTo: [
            SignalType.INFER,
            SignalType.STREAM,
            SignalType.ABORT,
            SignalType.CONNECT,
            ...Llm.reactToDecision(),
            ...Llm.reactToHttpClient(),
            ...Llm.reactToSseClient(),
            ...Llm.reactToMemory(),
            ...Llm.reactToZod(),
        ],
        inputs: [
            {
                signal: SignalType.INFER,
                type: DataType.INFER_PAYLOAD,
                schema: inferenceSchema,
                description: 'Inference request with purpose, goal/intention, context, and outputSchema',
            },
            {
                signal: SignalType.STREAM,
                type: DataType.INFER_PAYLOAD,
                schema: inferenceSchema,
                description: 'Streaming inference request with purpose, goal/intention, context, and outputSchema',
            },
            {
                signal: SignalType.ABORT,
                type: DataType.ABORT_PAYLOAD,
                description: 'Abort in-flight inference',
            },
            {
                signal: SignalType.CONNECT,
                type: DataType.VOID,
                description: 'Connect signal for health check',
            },
        ],
        outputs: [
            {
                signal: SignalType.INFERRED,
                type: DataType.INFER_RESULT,
                description: 'Inference result conforming to outputSchema and selected optimal model',
            },
            {
                signal: SignalType.STREAMING,
                type: DataType.UNKNOWN,
                description: 'Acknowledgment of streaming session start',
            },
            {
                signal: SignalType.STREAMED,
                type: DataType.STREAM_RESULT,
                description: 'Active streaming response source from SSE',
            },
            {
                signal: SignalType.STREAM_END,
                type: DataType.STREAM_END_RESULT,
                description: 'Streaming session completed',
            },
            {
                signal: SignalType.CONNECTED,
                type: DataType.STRING,
                description: 'Connection status acknowledgment',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.UNKNOWN,
                description: 'Inference failure or schema violation error',
            },
            {
                signal: DecisionSignalType.DECIDE,
                type: DecisionDataType.REQUEST,
                description: 'Probabilistic candidate model selection question for Decision UCA',
            },
            {
                signal: MemorySignalType.GET,
                type: MemoryDataType.GET_PAYLOAD,
                description: 'Query cached model selection in memory',
            },
            {
                signal: MemorySignalType.SAVE,
                type: MemoryDataType.SAVE_PAYLOAD,
                description: 'Persist chosen model in memory cache',
            },
        ],
    };

    private static reactToMemory(): string[] {
        return [
            MemorySignalType.RETRIEVED,
            MemorySignalType.SAVED,
            MemorySignalType.ERROR,
            ...Memory.disposition.reactTo ?? [],
        ];
    }

    private static reactToSseClient(): string[] {
        return [
            SseSignalType.STREAMED,
            SseSignalType.END,
            SseSignalType.ERROR,
            ...SseClient.disposition.reactTo ?? [],
        ];
    }

    private static reactToHttpClient(): string[] {
        return [
            HttpSignalType.RESPONSE,
            HttpSignalType.ERROR,
            ...HttpClient.disposition.reactTo ?? [],
        ];
    }


    private static reactToDecision(): string[] {
        return [
            DecisionSignalType.DECIDED,
            DecisionSignalType.ERROR,
            ...Decision.disposition.reactTo ?? [],
        ];
    }

    private static reactToZod(): string[] {
        return [
            ZodSignalType.VALIDATE,
            ZodSignalType.VALIDATED,
            ZodSignalType.DESCRIBE,
            ZodSignalType.DESCRIBED,
            ZodSignalType.ERROR,
            ...Zod.disposition.reactTo ?? [],
        ];
    }

    private readonly pendingInferences = new Map<string, PendingInference>();

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
        this.pendingInferences.clear();
        this.registry.forEach((capability) => {
            capability.denervate();
        });
        super.denervate();
    }

    protected override react(signal: Signal): void {
        const {
            property,
            value,
            source,
        } = signal;
        switch (property) {
            case SignalType.INFER:
                this.handleInfer(value as InferPayload, source);
                break;
            case SignalType.STREAM:
                this.handleStream(value as InferPayload, source);
                break;
            case SignalType.ABORT:
                this.handleAbort(value as AbortPayload);
                break;
            case SignalType.CONNECT:
                this.handleConnect();
                break;
            case DecisionSignalType.DECIDED:
                this.handleDecisionDecided(signal);
                break;
            case DecisionSignalType.ERROR:
                this.handleDecisionError(signal);
                break;
            case ZodSignalType.VALIDATED:
                this.handleZodValidated(signal);
                break;
            case ZodSignalType.ERROR:
                this.handleZodError(signal);
                break;
            case HttpSignalType.RESPONSE:
                this.handleBackendResponse(signal);
                break;
            case HttpSignalType.ERROR:
                this.handleBackendError(signal);
                break;
            case SseSignalType.STREAMED:
                this.handleSseStreamed(signal);
                break;
            case SseSignalType.END:
                this.handleSseEnd(signal);
                break;
            case SseSignalType.ERROR:
                this.handleSseError(signal);
                break;
            case MemorySignalType.RETRIEVED:
                this.handleMemoryRetrieved(signal);
                break;
            case MemorySignalType.SAVED:
                this.handleMemorySaved(signal);
                break;
            case MemorySignalType.ERROR:
                this.handleMemoryError(signal);
                break;
        }
    }

    protected override catalog(): Cooky {
        const {
            id,
        } = this;
        return [
            ...this.createClientCooky(id),
            ...this.createReasoningCooky(id),
        ];
    }

    private createClientCooky(id: string): Cooky {
        return [
            [HttpClient, this.createHttpClientDisposition(id)],
            [SseClient, this.createSseClientDisposition(id)],
        ];
    }

    private createReasoningCooky(id: string): Cooky {
        return [
            [Zod, this.createZodDisposition(id)],
            [Decision, this.createDecisionDisposition(id)],
            [Memory, this.createMemoryDisposition(id)],
        ];
    }

    private createZodDisposition(id: string): Disposition {
        return {
            ...Zod.disposition,
            aim: {
                description: Zod.AIM,
                body: {
                    id: `${id}:zod`,
                },
            },
        };
    }

    private createMemoryDisposition(id: string): Disposition {
        return {
            ...Memory.disposition,
            aim: {
                description: Memory.purpose,
                body: {
                    id: `${id}:memory`,
                    namespace: 'llm-models',
                },
            },
        };
    }

    private createSseClientDisposition(id: string): Disposition {
        return {
            ...SseClient.disposition,
            aim: {
                description: SseClient.AIM,
                body: {
                    endpoint: DEFAULT_SSE_ENDPOINT,
                    id: `${id}:sse-client`,
                },
            },
        };
    }

    private createHttpClientDisposition(id: string): Disposition {
        return {
            ...HttpClient.disposition,
            aim: {
                description: HttpClient.AIM,
                body: {
                    id: `${id}:http-client`,
                },
            },
        };
    }


    private createDecisionDisposition(id: string): Disposition {
        return {
            ...Decision.disposition,
            aim: {
                description: Decision.purpose,
                body: {
                    id: `${id}:decision`,
                },
            },
        };
    }

    private handleConnect(): void {
        this.pulse(SignalType.CONNECTED, 'connected');
    }

    private handleInfer(payload: InferPayload, replyTo: string): void {
        const { model } = payload;
        if (model) {
            this.dispatchBackendRequest(payload, replyTo);
            return;
        }
        this.resolveModelWithCache(payload, replyTo, SignalType.INFER);
    }

    private resolveModelWithCache(payload: InferPayload, replyTo: string, operation: SignalType): void {
        const cacheKey = this.resolveCacheKey(payload);
        if (!cacheKey) {
            this.requestModelDecision(payload, replyTo);
            return;
        }
        this.queryModelCache(cacheKey, payload, replyTo, operation);
    }

    private queryModelCache(key: string, payload: InferPayload, replyTo: string, operation: SignalType): void {
        const { sessionId = crypto.randomUUID() } = payload;
        this.pendingInferences.set(sessionId, { payload, replyTo, cacheKey: key, operation });
        this.pulse(MemorySignalType.GET, {
            key,
            sessionId,
        });
    }

    private resolveCacheKey(payload: InferPayload): string | null {
        const { id, streamId, sessionId, context } = payload;
        if (id === 'layout' || streamId?.includes(':layout')) {
            return 'model:layout';
        }
        if (id === 'view' || streamId?.includes(':view:')) {
            return this.resolveViewCacheKey(context, sessionId);
        }
        return null;
    }

    private resolveViewCacheKey(context: unknown, sessionId?: string): string {
        const ctx = context as { containerId?: string; area?: { parentId?: string } } | undefined;
        const baseId = sessionId?.includes(':') ? sessionId.split(':')[0] : sessionId;
        const layoutId = ctx?.containerId ?? ctx?.area?.parentId ?? baseId ?? 'default';
        return `model:view:${layoutId}`;
    }

    private handleMemoryRetrieved(signal: Signal): void {
        const { value, key, sessionId } = (signal.value ?? {}) as { value?: ChosenModelConfig | null; key?: string; sessionId?: string };
        const id = sessionId ?? signal.sessionId;
        const pending = id ? this.pendingInferences.get(id) : undefined;
        if (!pending) {
            return;
        }
        this.pendingInferences.delete(id!);
        const { payload, replyTo, cacheKey } = pending;
        if (value) {
            this.handleModelCacheHit(payload, value, key ?? cacheKey ?? '', replyTo);
            return;
        }
        this.handleModelCacheMiss(payload, replyTo, cacheKey);
    }

    private handleModelCacheHit(payload: InferPayload, config: ChosenModelConfig, key: string, replyTo?: string): void {
        const { sessionId = crypto.randomUUID() } = payload;
        const resolved = this.reconcileModelConfig(config, payload);
        if ((resolved.transport !== config.transport || resolved.model !== config.model) && key) {
            this.persistIfCached(key, resolved, sessionId);
        }
        this.dispatchDecisionChoice(payload, resolved, sessionId, replyTo);
    }

    private reconcileModelConfig(config: ChosenModelConfig, payload: InferPayload): ChosenModelConfig {
        const { model: rawModel, transport: cachedTransport } = config;
        const { streamId, outputSchema } = payload;
        const model = outputSchema && rawModel.includes('2.5') ? DEFAULT_GEMINI_FLASH_LITE_MODEL : rawModel;
        const candidate = AVAILABLE_MODELS.find(({ id, model: m }) => id === model || m === model);
        const transport = streamId || candidate?.transport === 'stream' ? 'stream' : (cachedTransport ?? 'stream');
        return { ...config, model, transport };
    }

    private handleModelCacheMiss(payload: InferPayload, replyTo?: string, cacheKey?: string): void {
        this.requestModelDecision(payload, replyTo ?? '', cacheKey);
    }

    private handleMemorySaved(_signal: Signal): void {
    }

    private handleMemoryError(signal: Signal): void {
        const { sessionId } = (signal.value ?? {}) as { sessionId?: string };
        const id = sessionId ?? signal.sessionId;
        const pending = id ? this.pendingInferences.get(id) : undefined;
        if (!pending) {
            return;
        }
        this.pendingInferences.delete(id!);
        const { payload, replyTo, cacheKey } = pending;
        this.handleModelCacheMiss(payload, replyTo, cacheKey);
    }

    private filterCandidates(_payload: InferPayload): typeof AVAILABLE_MODELS[number][] {
        return AVAILABLE_MODELS.filter(({ provider }) => provider !== 'jev');
    }

    private mapCandidateOption(item: typeof AVAILABLE_MODELS[number]): Record<string, unknown> {
        const { id, label, description, criteria, imagination, limit } = item;
        const configSummary = `[config: imagination=${imagination}, limit=${limit}]`;
        return { id, label, description: `${description} ${configSummary}`, criteria };
    }

    private buildModelSelectionQuestion(payload: InferPayload): Record<string, unknown> {
        const { outputSchema } = payload;
        const options = this.filterCandidates(payload).map((item) => this.mapCandidateOption(item));
        const prompt = outputSchema
            ? 'Select optimal model and profile according to purpose, intention, context, and schema constraint capacity (must support complex structured schemas without exceeding serving state limits)'
            : 'Select optimal model and configuration profile according to purpose, intention, and context';
        return {
            id: 'model_selection',
            type: 'choice',
            prompt,
            options,
        };
    }

    private createDecisionContext(payload: InferPayload): Record<string, unknown> {
        const { purpose, goal, intention, context, contextSchema, outputSchema } = payload;
        const schemaConst = (contextSchema as Record<string, unknown> | undefined)?.const;
        const stateContext = (context ?? schemaConst ?? {}) as Record<string, unknown>;
        return {
            purpose,
            intention: goal ?? intention ?? purpose,
            context: stateContext,
            requiresStructuredSchema: Boolean(outputSchema),
        };
    }

    private requestModelDecision(payload: InferPayload, replyTo: string, cacheKey?: string): void {
        const { sessionId = crypto.randomUUID() } = payload;
        const decisionSessionId = `${sessionId}:model-select`;
        this.pendingInferences.set(decisionSessionId, { payload, replyTo, cacheKey });
        this.pulse(DecisionSignalType.DECIDE, {
            sessionId: decisionSessionId,
            question: this.buildModelSelectionQuestion(payload),
            context: this.createDecisionContext(payload),
        }, undefined, decisionSessionId);
    }

    private extractModelConfig(candidate: typeof AVAILABLE_MODELS[number]): ChosenModelConfig {
        const { provider, model, transport, imagination, limit } = candidate;
        const thinkingBudget = 'thinkingBudget' in candidate ? (candidate.thinkingBudget as number) : undefined;
        const thinkingLevel = 'thinkingLevel' in candidate ? (candidate.thinkingLevel as ThinkingLevel) : undefined;
        return {
            provider: provider as ProviderType,
            model,
            transport,
            imagination,
            limit,
            ...(thinkingBudget !== undefined && { thinkingBudget }),
            ...(thinkingLevel !== undefined && { thinkingLevel }),
        };
    }

    private resolveChosenModel(choice: string): ChosenModelConfig {
        const candidate = AVAILABLE_MODELS.find(({ id }) => id === choice);
        if (candidate) {
            return this.extractModelConfig(candidate);
        }
        return {
            provider: DEFAULT_PROVIDER as ProviderType,
            model: DEFAULT_GEMINI_FLASH_LITE_MODEL,
            transport: 'stream',
        };
    }

    private extractDecisionPayload(signal: Signal): {
        sessionId: string;
        result?: DecisionResult['result'];
    } {
        const payload = (signal.value ?? {}) as DecisionResult & { sessionId?: string };
        const sessionId = signal.sessionId ?? payload.sessionId ?? '';
        const { result } = payload;
        return { sessionId, result };
    }

    private handleDecisionDecided(signal: Signal): void {
        const { sessionId, result } = this.extractDecisionPayload(signal);
        if (!result || !sessionId) { return; }
        const pending = this.pendingInferences.get(sessionId);
        if (!pending) { return; }
        this.pendingInferences.delete(sessionId);
        const { payload, replyTo, cacheKey } = pending;
        this.applyDecisionResult(result.choice, payload, sessionId, replyTo, cacheKey);
    }

    private applyDecisionResult(
        choice: string,
        payload: InferPayload,
        sessionId: string,
        replyTo?: string,
        cacheKey?: string,
    ): void {
        const modelConfig = this.resolveChosenModel(choice);
        this.persistIfCached(cacheKey, modelConfig, sessionId);
        this.dispatchDecisionChoice(payload, modelConfig, sessionId, replyTo);
    }

    private persistIfCached(key: string | undefined, config: ChosenModelConfig, sessionId?: string): void {
        if (!key) {
            return;
        }
        this.pulse(MemorySignalType.SAVE, {
            key,
            value: config,
            sessionId,
        });
    }

    private dispatchDecisionChoice(payload: InferPayload, config: ChosenModelConfig, sessionId: string, replyTo?: string): void {
        const operation = config.transport === 'stream' ? SignalType.STREAM : SignalType.INFER;
        if (operation === SignalType.STREAM) {
            this.pulse(SignalType.STREAMING, { sessionId, model: config.model, transport: 'stream' }, replyTo, sessionId);
        }
        this.dispatchBackendRequest({ ...payload, ...config, sessionId }, replyTo ?? '', operation);
    }

    private handleDecisionError(signal: Signal): void {
        const { sessionId } = (signal.value ?? {}) as { sessionId?: string };
        const id = sessionId ?? signal.sessionId;
        if (!id) { return; }
        const pending = this.pendingInferences.get(id);
        if (!pending) { return; }
        this.pendingInferences.delete(id);
        const { payload, replyTo } = pending;
        const fallback = { ...payload, provider: DEFAULT_PROVIDER as ProviderType, model: DEFAULT_GEMINI_FLASH_LITE_MODEL, sessionId: id };
        this.dispatchBackendRequest(fallback, replyTo ?? '');
    }

    private dispatchBackendRequest(
        payload: InferPayload,
        replyTo: string,
        operation: SignalType = SignalType.INFER,
    ): void {
        const body = this.backendPayload(payload);
        const { sessionId, provider } = body;
        const context = { operation, sessionId, provider, replyTo, request: body };
        this.pulse(ZodSignalType.VALIDATE, { schema: inferenceSchema, value: body, context });
    }

    private handleZodValidated(signal: Signal): void {
        const { value, context } = (signal.value ?? {}) as ValidatedResult;
        const { operation, replyTo = '' } = (context ?? {}) as { operation?: SignalType; replyTo?: string };
        const body = this.normalizeOutputSchema(value as InferPayload);
        if (operation === SignalType.STREAM) {
            this.dispatchStreamRequest(body, replyTo);
            return;
        }
        this.dispatchHttpRequest(body, replyTo);
    }

    private normalizeOutputSchema(body: InferPayload): InferPayload {
        const { outputSchema } = body;
        if (outputSchema && typeof outputSchema === 'object' && 'safeParse' in outputSchema) {
            const jsonSchema = Zod.toJsonSchema(outputSchema as z.ZodType);
            return { ...body, outputSchema: jsonSchema };
        }
        return body;
    }

    private handleZodError(signal: Signal): void {
        const { error, context } = (signal.value ?? {}) as ErrorResult;
        const { sessionId, provider, replyTo, request } = (context ?? {}) as { sessionId?: string; provider?: ProviderType; replyTo?: string; request?: InferPayload };
        const target = replyTo ?? this.resultTarget(provider);
        this.pulse(SignalType.ERROR, { error, sessionId, request }, target);
    }

    private dispatchStreamRequest(
        body: InferPayload,
        replyTo: string,
    ): void {
        const {
            sessionId,
        } = body;
        this.pulse(SseSignalType.STREAM, {
            ...body,
            endpoint: DEFAULT_SSE_ENDPOINT,
            sessionId,
            context: { ...body, replyTo, sessionId },
        });
    }

    private dispatchHttpRequest(
        body: InferPayload,
        replyTo: string,
    ): void {
        const {
            sessionId,
        } = body;
        const {
            endpoint = DEFAULT_ENDPOINT,
        } = this.disposition.aim.body ?? {};
        this.pulse(HttpSignalType.REQUEST, {
            endpoint,
            payload: body,
            sessionId,
            context: { ...body, replyTo, sessionId },
        });
    }

    private handleStream(payload: InferPayload, replyTo: string): void {
        const { model } = payload;
        if (model) {
            this.dispatchBackendRequest(payload, replyTo, SignalType.STREAM);
            return;
        }
        this.resolveModelWithCache(payload, replyTo, SignalType.STREAM);
    }

    private handleSseStreamed(signal: Signal): void {
        const { sessionId: streamSessionId, stream, context } = (signal.value ?? {}) as SseStreamResult;
        const sessionId = signal.sessionId ?? streamSessionId;
        const { replyTo, ...request } = (context ?? {}) as TransportContext;
        const { model, context: requestContext } = request;
        const target = replyTo ?? this.resultTarget();
        const payload = { sessionId, stream, model, request, context: requestContext ?? request };
        this.pulse(SignalType.STREAMED, payload, target, sessionId);
    }

    private handleSseEnd(signal: Signal): void {
        const { sessionId, context } = (signal.value ?? {}) as { sessionId?: string; context?: unknown };
        const { replyTo, model } = (context ?? {}) as { replyTo?: string; model?: string };
        const target = replyTo ?? this.resultTarget();
        this.pulse(SignalType.STREAM_END, { sessionId, model }, target, sessionId);
    }

    private handleSseError(signal: Signal): void {
        const { context, ...failure } = (signal.value ?? {}) as ErrorPayload;
        const { replyTo, sessionId } = (context ?? {}) as TransportContext & { sessionId?: string };
        const target = replyTo ?? this.resultTarget();
        this.pulse(SignalType.ERROR, failure, target, sessionId);
    }


    private backendPayload(payload: InferPayload): InferPayload {
        const { aim } = this.disposition;
        const { provider = DEFAULT_PROVIDER, model, imagination, limit, thinkingBudget, thinkingLevel } = aim.body ?? {};
        const { id: _target, sessionId = crypto.randomUUID(), goal, intention, ...request } = payload;
        const resolvedGoal = goal ?? intention ?? '';
        return { provider, model, imagination, limit, thinkingBudget, thinkingLevel, ...request, goal: resolvedGoal, sessionId };
    }

    private handleBackendResponse(signal: Signal): void {
        const { data, context } = signal.value as ResponsePayload;
        const { replyTo, ...request } = context as TransportContext & { sessionId?: string };
        const target = replyTo ?? this.resultTarget(request.provider);
        const result = data as InferResult;
        const sessionId = result.sessionId ?? request.sessionId ?? signal.sessionId;
        this.pulse(SignalType.INFERRED, { ...result, sessionId, request }, target, sessionId);
    }

    private handleBackendError(signal: Signal): void {
        const { context, ...failure } = signal.value as ErrorPayload;
        const { replyTo, ...request } = (context ?? {}) as TransportContext & { sessionId?: string };
        if (this.retryWithFallbackModel(request, replyTo)) {
            return;
        }
        const target = replyTo ?? this.resultTarget(request.provider);
        this.pulse(SignalType.ERROR, { ...failure, request }, target, request.sessionId);
    }

    private retryWithFallbackModel(request: InferPayload, replyTo?: string): boolean {
        const { model } = request;
        const extended = request as InferPayload & { fallbackAttempted?: boolean };
        if (extended.fallbackAttempted || model === DEFAULT_GEMINI_FLASH_LITE_MODEL) {
            return false;
        }
        const fallback = { ...request, model: DEFAULT_GEMINI_FLASH_LITE_MODEL, fallbackAttempted: true };
        this.updateFallbackCache(request);
        this.dispatchHttpRequest(fallback, replyTo ?? '');
        return true;
    }

    private updateFallbackCache(request: InferPayload): void {
        const cacheKey = this.resolveCacheKey(request);
        if (!cacheKey) {
            return;
        }
        const config = {
            provider: DEFAULT_PROVIDER as ProviderType,
            model: DEFAULT_GEMINI_FLASH_LITE_MODEL,
            transport: 'stream' as const,
        };
        this.persistIfCached(cacheKey, config, request.sessionId);
    }

    private handleAbort(value: AbortPayload): void {
        this.pulse(HttpSignalType.ABORT, value);
    }

    private resultTarget(provider?: ProviderType): string | undefined {
        const { id } = this;
        const parent = id.includes(':') ? id.slice(0, id.lastIndexOf(':')) : undefined;
        return parent && provider === 'jev' ? `${parent}:decision` : parent;
    }
}

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
import { Schema } from '@uca/capability-schema';
import {
    SignalType as SchemaSignalType,
    type ValidatedResult,
    type ErrorResult,
} from '@uca/capability-schema/types';
import { Decision } from '@uca/decision';
import {
    SignalType as DecisionSignalType,
    DataType as DecisionDataType,
    type Result as DecisionResult,
} from '@uca/decision/types';
import { SseClient } from '@uca/capability-sse-client';
import {
    SignalType as SseSignalType,
    type StreamResult as SseStreamResult,
} from '@uca/capability-sse-client/types';
import { DEFAULT_ENDPOINT as DEFAULT_SSE_ENDPOINT } from '@uca/capability-sse-client/constants';
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
    type ValidationContext,
    type TransportContext,
    type AbortPayload,
    type ChosenModelConfig,
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
            ...Llm.reactToSchema(),
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
        ],
    };

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

    private static reactToSchema(): string[] {
        return [
            SchemaSignalType.VALIDATE,
            SchemaSignalType.VALIDATED,
            SchemaSignalType.ERROR,
            ...Schema.disposition.reactTo ?? [],
        ];
    }

    private static reactToDecision(): string[] {
        return [
            DecisionSignalType.DECIDED,
            DecisionSignalType.ERROR,
            ...Decision.disposition.reactTo ?? [],
        ];
    }

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
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
            case SchemaSignalType.VALIDATED:
                this.handleValidated(value as ValidatedResult);
                break;
            case SchemaSignalType.ERROR:
                this.handleValidationError(value as ErrorResult);
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
        }
    }

    protected override catalog(): Cooky {
        const {
            id,
        } = this;
        return [
            [HttpClient, this.createHttpClientDisposition(id)],
            [SseClient, this.createSseClientDisposition(id)],
            [Schema, this.createSchemaDisposition(id)],
            [Decision, this.createDecisionDisposition(id)],
        ];
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

    private createSchemaDisposition(id: string): Disposition {
        return {
            ...Schema.disposition,
            aim: {
                description: Schema.AIM,
                body: {
                    id: `${id}:schema`,
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

    private logInferInput(payload: InferPayload): void {
        const { purpose, goal, intention, correlationId } = payload;
        const resolvedGoal = goal ?? intention ?? purpose;
        console.log('%c[LLM::INPUT]', 'color: #2563EB; font-weight: bold;', { correlationId, purpose, intention: resolvedGoal, payload });
    }

    private logInferResponse(correlationId?: string, model?: string, data?: unknown): void {
        console.log('%c[LLM::RESPONSE]', 'color: #16A34A; font-weight: bold;', { correlationId, model, data });
    }

    private handleInfer(payload: InferPayload, replyTo: string): void {
        this.logInferInput(payload);
        const {
            model,
        } = payload;
        if (model) {
            this.requestValidation(payload, replyTo);
            return;
        }
        this.requestModelDecision(payload, replyTo);
    }

    private filterCandidates(payload: InferPayload): typeof AVAILABLE_MODELS[number][] {
        const { outputSchema } = payload;
        if (outputSchema) {
            return AVAILABLE_MODELS.filter(({ provider }) => provider !== 'jev');
        }
        return [...AVAILABLE_MODELS];
    }

    private mapCandidateOption(item: typeof AVAILABLE_MODELS[number]): Record<string, unknown> {
        const { id, label, description, criteria, imagination, limit } = item;
        const configSummary = `[config: imagination=${imagination}, limit=${limit}]`;
        return { id, label, description: `${description} ${configSummary}`, criteria };
    }

    private buildModelSelectionQuestion(payload: InferPayload): Record<string, unknown> {
        const options = this.filterCandidates(payload).map((item) => this.mapCandidateOption(item));
        return {
            id: 'model_selection',
            type: 'choice',
            prompt: 'Select optimal model and configuration profile according to purpose, intention, and context',
            options,
        };
    }

    private createDecisionContext(payload: InferPayload, replyTo: string): Record<string, unknown> {
        const { purpose, goal, intention, context, contextSchema } = payload;
        const schemaConst = (contextSchema as Record<string, unknown> | undefined)?.const;
        const stateContext = (context ?? schemaConst ?? {}) as Record<string, unknown>;
        return {
            purpose,
            intention: goal ?? intention ?? purpose,
            context: stateContext,
            originalPayload: payload,
            replyTo,
        };
    }

    private logModelDecisionRequest(correlationId: string, payload: InferPayload): void {
        const { purpose, goal, intention } = payload;
        const candidates = this.filterCandidates(payload);
        console.log('[LLM::MODEL_DECISION::REQUEST]', {
            correlationId,
            purpose,
            intention: goal ?? intention ?? purpose,
            candidates,
        });
    }

    private logModelDecisionResponse(correlationId: string, choice: string, config: { provider: string; model: string }, confidence?: number, probabilities?: unknown): void {
        console.log('[LLM::MODEL_DECISION::RESPONSE]', { correlationId, choice, provider: config.provider, model: config.model, confidence, probabilities });
    }

    private requestModelDecision(payload: InferPayload, replyTo: string): void {
        const decisionContext = this.createDecisionContext(payload, replyTo);
        const { correlationId = crypto.randomUUID() } = payload;
        this.logModelDecisionRequest(correlationId, payload);
        this.pulse(DecisionSignalType.DECIDE, {
            correlationId,
            question: this.buildModelSelectionQuestion(payload),
            context: decisionContext,
        });
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
        return { provider: DEFAULT_PROVIDER as ProviderType, model: DEFAULT_GEMINI_FLASH_LITE_MODEL, transport: 'batch' };
    }

    private handleDecisionDecided(signal: Signal): void {
        const { correlationId, result } = (signal.value ?? {}) as DecisionResult;
        const { choice, context, confidence, probabilities } = result ?? {};
        const { originalPayload, replyTo } = (context ?? {}) as { originalPayload?: InferPayload; replyTo?: string };
        if (!originalPayload) {
            return;
        }
        const modelConfig = this.resolveChosenModel(choice);
        this.logModelDecisionResponse(correlationId, choice, modelConfig, confidence, probabilities);
        this.dispatchDecisionChoice(originalPayload, modelConfig, correlationId, replyTo);
    }

    private dispatchDecisionChoice(payload: InferPayload, config: ChosenModelConfig, correlationId: string, replyTo?: string): void {
        const operation = config.transport === 'stream' ? SignalType.STREAM : SignalType.INFER;
        if (operation === SignalType.STREAM) {
            console.log('[LLM::STREAMING::START]', { correlationId, model: config.model, transport: 'stream' });
            this.pulse(SignalType.STREAMING, { correlationId, model: config.model, transport: 'stream' }, replyTo);
        }
        this.requestValidation({ ...payload, ...config, correlationId }, replyTo ?? '', operation);
    }

    private handleDecisionError(signal: Signal): void {
        const { correlationId, context, error } = (signal.value ?? {}) as { correlationId?: string; context?: Record<string, unknown>; error?: unknown };
        const { originalPayload, replyTo } = (context ?? {}) as { originalPayload?: InferPayload; replyTo?: string };
        if (!originalPayload) {
            return;
        }
        console.warn('[LLM::MODEL_DECISION::FALLBACK]', { correlationId, error, fallback: DEFAULT_GEMINI_FLASH_LITE_MODEL });
        const fallback = { ...originalPayload, provider: DEFAULT_PROVIDER as ProviderType, model: DEFAULT_GEMINI_FLASH_LITE_MODEL, correlationId };
        this.requestValidation(fallback, replyTo ?? '');
    }

    private requestValidation(payload: InferPayload, replyTo: string, operation: SignalType = SignalType.INFER): void {
        const value = this.backendPayload(payload);
        const { correlationId, provider } = value;
        const context = { operation, correlationId, provider, replyTo, request: value };
        this.pulse(SchemaSignalType.VALIDATE, { schema: inferenceSchema, value, context });
    }

    private handleValidated(result: ValidatedResult): void {
        const { value, context } = result;
        const { operation, replyTo } = context as ValidationContext;
        const { endpoint = DEFAULT_ENDPOINT } = this.disposition.aim.body ?? {};
        const body = value as InferPayload;
        if (operation === SignalType.STREAM) {
            this.pulse(SseSignalType.STREAM, { ...body, endpoint: DEFAULT_SSE_ENDPOINT, correlationId: body.correlationId, context: { ...body, replyTo } });
            return;
        }
        this.pulse(HttpSignalType.REQUEST, { endpoint, payload: body, correlationId: body.correlationId, context: { ...body, replyTo } });
    }

    private handleStream(payload: InferPayload, replyTo: string): void {
        this.logInferInput(payload);
        const { model } = payload;
        if (model) {
            this.requestValidation(payload, replyTo, SignalType.STREAM);
            return;
        }
        this.requestModelDecision(payload, replyTo);
    }

    private handleSseStreamed(signal: Signal): void {
        const {
            correlationId,
            stream,
            context,
        } = signal.value as SseStreamResult;
        const { replyTo, ...request } = context as TransportContext;
        const {
            model,
        } = request;
        const target = replyTo ?? this.resultTarget();
        this.pulse(SignalType.STREAMED, {
            correlationId,
            stream,
            model,
            request,
        }, target);
    }

    private handleSseEnd(signal: Signal): void {
        const { correlationId, context } = (signal.value ?? {}) as { correlationId?: string; context?: unknown };
        const { replyTo, model } = (context ?? {}) as { replyTo?: string; model?: string };
        const target = replyTo ?? this.resultTarget();
        console.log('[LLM::STREAMING::END]', { correlationId, model });
        this.pulse(SignalType.STREAM_END, { correlationId, model }, target);
    }

    private handleSseError(signal: Signal): void {
        const { context, ...failure } = (signal.value ?? {}) as ErrorPayload;
        const { replyTo } = (context ?? {}) as TransportContext;
        const target = replyTo ?? this.resultTarget();
        this.pulse(SignalType.ERROR, failure, target);
    }

    private handleValidationError(result: ErrorResult): void {
        const { error, context } = result;
        const { correlationId, provider, replyTo, request } = context as ValidationContext;
        const target = replyTo ?? this.resultTarget(provider);
        this.pulse(SignalType.ERROR, { error, correlationId, request }, target);
    }

    private backendPayload(payload: InferPayload): InferPayload {
        const { aim } = this.disposition;
        const { provider = DEFAULT_PROVIDER, model, imagination, limit, thinkingBudget, thinkingLevel } = aim.body ?? {};
        const { id: _target, correlationId = crypto.randomUUID(), goal, intention, ...request } = payload;
        const resolvedGoal = goal ?? intention ?? '';
        return { provider, model, imagination, limit, thinkingBudget, thinkingLevel, ...request, goal: resolvedGoal, correlationId };
    }

    private handleBackendResponse(signal: Signal): void {
        const { data, context, correlationId } = signal.value as ResponsePayload;
        const { replyTo, ...request } = context as TransportContext;
        const target = replyTo ?? this.resultTarget(request.provider);
        const result = data as InferResult;
        this.logInferResponse(correlationId, result?.model, result?.data ?? result);
        this.pulse(SignalType.INFERRED, { ...result, correlationId, request }, target);
    }

    private handleBackendError(signal: Signal): void {
        const { context, ...failure } = signal.value as ErrorPayload;
        const { replyTo, ...request } = context as TransportContext;
        const target = replyTo ?? this.resultTarget(request.provider);
        this.pulse(SignalType.ERROR, { ...failure, request }, target);
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

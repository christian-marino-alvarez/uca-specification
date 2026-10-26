import { z } from 'zod';
import { signalBodySchema } from '../schema.js';
import { Uca } from '@uca/core/uca';
import { Llm } from '@uca/capability-llm';
import type {
    Cooky,
    Disposition,
    Signal,
} from '@uca/core/types';
import {
    SignalType as LlmSignalType,
    type InferResult,
    type Failure as InferenceFailure,
} from '@uca/capability-llm/types';
import {
    __ID__,
    DEFAULT_CONFIGURATION,
    DUPLICATE_OPTIONS,
    INFERENCE_LIMITS,
    INVALID_PROBABILITIES,
    MAXIMUM_RETRIES,
    MISMATCHED_SESSION,
    MISSING_METADATA,
    PROBABILITY_TOLERANCE,
    RECOVERY_INSTRUCTION,
    UNKNOWN_SELECTION,
} from './constants.js';
import {
    bodySchema,
    choiceResultSchema,
    configurationSchema,
    errorSchema,
    identitySchema,
    metadataSchema,
    probabilitySchema,
    questionSchema,
    requestSchema,
    resultSchema,
    type Body,
    type Configuration,
    type DecisionPayload,
    type Metadata,
    type OptionItem,
    type Question,
    type Request,
    type ValidationContext,
} from './schema.js';
import {
    DataType,
    QuestionType,
    SignalType,
} from './types.js';

export class Decision extends Uca<Body> {
    public static override purpose = 'Perform fast, lightweight probabilistic candidate selection and binary decisions with zero imagination';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Decision.purpose,
            body: {
                configuration: DEFAULT_CONFIGURATION,
            },
        },
        reactTo: [
            SignalType.DECIDE,
            ...Decision.reactToLlm(),
        ],
        inputs: [
            {
                signal: SignalType.DECIDE,
                type: DataType.REQUEST,
                schema: requestSchema,
            },
        ],
        outputs: [
            {
                signal: SignalType.DECIDED,
                type: DataType.RESULT,
                schema: resultSchema,
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
                schema: errorSchema,
            },
        ],
    };

    private static reactToLlm(): string[] {
        const {
            reactTo = [],
        } = Llm.disposition;
        return [
            ...reactTo,
            LlmSignalType.INFERRED,
            LlmSignalType.ERROR,
        ];
    }

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
        const {
            registry,
        } = this;
        registry.forEach((capability) => {
            capability.denervate();
        });
        super.denervate();
    }

    protected override catalog(): Cooky {
        const {
            id,
        } = this;
        return [
            [
                Llm,
                {
                    ...Llm.disposition,
                    aim: {
                        description: Llm.AIM,
                        body: {
                            id: `${id}:llm`,
                        },
                    },
                },
            ],
        ];
    }

    protected override react(signal: Signal): void {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.DECIDE:
                this.handleDecide(signal);
                break;
            case LlmSignalType.INFERRED:
                this.handleLlmInferred(signal);
                break;
            case LlmSignalType.ERROR:
                this.handleLlmError(signal);
                break;
        }
    }

    private extractDecisionQuestion(value: Record<string, unknown>, context: Record<string, unknown>): Question {
        const direct = value.question as Question | undefined;
        const fromContext = context.question as Question | undefined;
        return (direct ?? fromContext) as Question;
    }

    private normalizeDecisionRequest(value: unknown, sessionId?: string): Request {
        const val = (value ?? {}) as Record<string, unknown>;
        const context = (val.context ?? val) as Record<string, unknown>;
        const question = this.extractDecisionQuestion(val, context);
        const resolvedId = sessionId ?? (val.sessionId as string) ?? crypto.randomUUID();
        return {
            sessionId: resolvedId,
            question,
            context,
        };
    }

    private handleDecide(signal: Signal): void {
        const {
            value,
            source,
            sessionId,
        } = signal;
        const request = this.normalizeDecisionRequest(value, sessionId);
        this.processValidatedRequest(request, source);
    }

    private processValidatedRequest(request: Request, replyTo: string): void {
        try {
            const outputSchema = this.createAnswerSchema(request);
            this.sendInference(request, outputSchema, replyTo);
        }
        catch (error) {
            this.emitFailure(error, request, replyTo);
        }
    }

    private handleLlmInferred(signal: Signal): void {
        const {
            value,
            sessionId,
        } = signal;
        const inferred = value as InferResult;
        const operation = this.extractDecisionOperation(inferred.context, sessionId ?? inferred.sessionId);
        this.processLlmInferred(inferred, operation);
    }

    private processLlmInferred(inferred: InferResult, metadata: unknown): void {
        try {
            const operation = metadataSchema.parse(metadata);
            const decision = this.validateInference(inferred, operation);
            this.emitDecided(decision, operation);
        }
        catch (error) {
            this.recoverInference(inferred, error);
        }
    }

    private emitDecided(decision: DecisionPayload, operation: Metadata): void {
        const {
            replyTo,
            request,
        } = operation;
        const {
            context,
        } = request;
        this.pulse(SignalType.DECIDED, {
            result: decision,
            context,
        }, replyTo);
    }

    private handleLlmError(signal: Signal): void {
        const {
            value,
        } = signal;
        const failure = value as InferenceFailure;
        const {
            error,
        } = failure;
        this.recoverInference(failure, error, false);
    }

    private createAnswerSchema(request: Request): Record<string, unknown> {
        const {
            question: {
                options,
            },
        } = request;
        const identifiers = options.map(({ id }) => id);
        if (new Set(identifiers).size !== options.length) {
            throw new Error(DUPLICATE_OPTIONS);
        }
        return this.buildChoiceAnswerSchema(identifiers);
    }

    private buildChoiceAnswerSchema(identifiers: string[]): Record<string, unknown> {
        const choiceEnum = z.enum(identifiers);
        return z.toJSONSchema(choiceResultSchema.extend({
            choice: choiceEnum,
            probabilities: z.record(
                choiceEnum,
                probabilitySchema,
            ),
        }));
    }

    private sendInference(request: Request, outputSchema: Record<string, unknown>, replyTo: string): void {
        const config = this.resolveInferenceConfig();
        const payload = this.buildInferencePayload(request, outputSchema, replyTo, config);
        signalBodySchema.parse(payload);
        this.pulse(LlmSignalType.INFER, payload);
    }

    private resolveInferenceConfig(): Configuration {
        const {
            aim: {
                body,
            },
        } = this.disposition;
        const {
            configuration = DEFAULT_CONFIGURATION,
        } = body ?? {};
        return configurationSchema.parse(configuration);
    }

    private buildCriteriaMap(options: OptionItem[]): Record<string, unknown> {
        return Object.fromEntries(
            options.map((opt) => [opt.id, opt.criteria ?? opt.description ?? opt.label ?? opt.id]),
        );
    }

    private sanitizeEvaluationState(context?: Record<string, unknown>): Record<string, unknown> {
        if (!context) { return {}; }
        const {
            originalPayload: _originalPayload,
            replyTo: _replyTo,
            question: _question,
            ...state
        } = context;
        return state;
    }

    private buildDecisionContext(
        request: Request,
        criteriaMap: Record<string, unknown>,
        replyTo: string,
        attempt = 0,
    ): Record<string, unknown> {
        const { question, context, sessionId } = request;
        const { id, prompt, options } = question;
        const limits = { ...this.disposition.limits, ...INFERENCE_LIMITS };
        const state = this.sanitizeEvaluationState(context);
        const questionData = { id, type: QuestionType.CHOICE, instructions: prompt, criteria: criteriaMap, options };
        return { sessionId, state, question: questionData, limits, replyTo, attempt };
    }

    private assembleInferencePayload(
        req: Request,
        ctx: Record<string, unknown>,
        schema: Record<string, unknown>,
        cfg: Configuration,
    ): Record<string, unknown> {
        const { question } = req;
        return {
            ...cfg,
            id: this.id,
            purpose: Decision.purpose,
            intention: question.prompt,
            outputSchema: schema,
            context: ctx,
        };
    }

    private buildInferencePayload(
        request: Request,
        outputSchema: Record<string, unknown>,
        replyTo: string,
        config: Configuration,
        attempt = 0,
    ): Record<string, unknown> {
        const criteriaMap = this.buildCriteriaMap(request.question.options);
        const context = this.buildDecisionContext(request, criteriaMap, replyTo, attempt);
        return this.assembleInferencePayload(request, context, outputSchema, config);
    }

    private reconstructRequest(ctx: {
        sessionId?: string;
        requestContext?: Record<string, unknown>;
        state?: Record<string, unknown>;
        question?: { id: string; options: OptionItem[]; instructions?: string; prompt?: string };
    }): Request {
        const { sessionId = '', requestContext, state = {}, question } = ctx;
        return {
            sessionId,
            question: {
                id: question?.id ?? 'question',
                type: QuestionType.CHOICE,
                prompt: question?.prompt ?? question?.instructions ?? '',
                options: question?.options ?? [],
            },
            context: requestContext ?? state,
        };
    }

    private extractDecisionOperation(context: unknown, sessionId?: string): Metadata {
        const ctx = (context ?? {}) as { replyTo?: string; attempt?: number; sessionId?: string };
        const { replyTo = '', attempt = 0 } = ctx;
        const sid = sessionId ?? ctx.sessionId ?? '';
        const request = this.reconstructRequest({ ...ctx, sessionId: sid });
        return { replyTo, attempt, request };
    }

    private extractAnswerPayload(inferred: InferResult, questionId: string): Record<string, unknown> {
        const { data, response } = inferred;
        const payload = (data ?? JSON.parse(response ?? '')) as Record<string, unknown>;
        return (payload[questionId] ?? payload) as Record<string, unknown>;
    }

    private validateInference(inferred: InferResult, operation: Metadata): DecisionPayload {
        const { sessionId } = inferred;
        const { request: { sessionId: expectedId, question: { id: questionId, options } } } = operation;
        if (sessionId !== expectedId) {
            throw new Error(MISMATCHED_SESSION);
        }
        const answer = this.extractAnswerPayload(inferred, questionId);
        const choiceResult = choiceResultSchema.parse(answer);
        return this.verifyChoice(choiceResult, questionId, options);
    }

    private validateProbabilities(options: Request['question']['options'], choice: string, probabilities: Record<string, number>): void {
        const validOption = options.some((opt) => opt.id === choice);
        if (!validOption) {
            throw new Error(UNKNOWN_SELECTION);
        }
        const sum = Object.values(probabilities).reduce((acc, val) => acc + val, 0);
        if (Math.abs(sum - 1) > PROBABILITY_TOLERANCE) {
            throw new Error(INVALID_PROBABILITIES);
        }
    }

    private verifyChoice(
        result: z.infer<typeof choiceResultSchema>,
        questionId: string,
        options: Request['question']['options'],
    ): DecisionPayload {
        const {
            choice,
            confidence,
            probabilities,
            assessment,
        } = result;
        this.validateProbabilities(options, choice, probabilities);
        return {
            questionId,
            choice,
            confidence,
            probabilities,
            ...(assessment && {
                assessment,
            }),
        };
    }

    private recoverInference(inferred: InferResult | InferenceFailure, error: unknown, retry = true): void {
        const {
            context,
            sessionId,
        } = inferred;
        const operation = this.extractDecisionOperation(context, sessionId);
        if (!operation.replyTo && !sessionId) {
            this.emitFailure(MISSING_METADATA, { sessionId }, undefined, 1);
            return;
        }
        this.executeRecoveryAttempt(inferred, operation, error, retry);
    }

    private executeRecoveryAttempt(
        inferred: InferResult | InferenceFailure,
        operation: Metadata,
        error: unknown,
        retry: boolean,
    ): void {
        const {
            request,
            replyTo,
            attempt,
        } = operation;
        if (!retry || attempt >= MAXIMUM_RETRIES) {
            this.emitFailure(error, request, replyTo, attempt + 1);
            return;
        }
        this.dispatchRecovery(inferred, operation, error);
    }

    private buildRecoveryLimits(limits: Record<string, unknown>, rejected: unknown, error: unknown): Record<string, unknown> {
        return {
            ...limits,
            recovery: {
                instruction: RECOVERY_INSTRUCTION,
                rejected,
                error: error instanceof Error ? error.message : String(error),
            },
        };
    }

    private assembleRecoveryPayload(
        operation: Metadata,
        rejected: unknown,
        error: unknown,
    ): Record<string, unknown> {
        const { request, replyTo, attempt } = operation;
        const config = this.resolveInferenceConfig();
        const outputSchema = this.createAnswerSchema(request);
        const basePayload = this.buildInferencePayload(request, outputSchema, replyTo, config, attempt + 1);
        const context = basePayload.context as Record<string, unknown>;
        const limits = (context.limits ?? {}) as Record<string, unknown>;
        const recoveryLimits = this.buildRecoveryLimits(limits, rejected, error);
        return { ...basePayload, context: { ...context, limits: recoveryLimits } };
    }

    private dispatchRecovery(
        inferred: InferResult | InferenceFailure,
        operation: Metadata,
        error: unknown,
    ): void {
        const { data, response } = inferred as InferResult;
        const payload = this.assembleRecoveryPayload(operation, data ?? response, error);
        this.pulse(LlmSignalType.INFER, payload);
    }

    private emitFailure(error: unknown, identity: unknown, replyTo?: string, attempts = 0): void {
        const {
            data,
        } = identitySchema.safeParse(identity);
        const {
            sessionId = null,
        } = data ?? {};
        this.pulse(SignalType.ERROR, {
            sessionId,
            error: error instanceof Error ? error.message : String(error),
            attempts,
        }, replyTo);
    }
}

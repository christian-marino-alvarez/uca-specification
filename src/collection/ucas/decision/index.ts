import { z } from 'zod';
import { Uca } from '@uca/core/uca';
import { Llm } from '@uca/capability-llm';
import { Schema } from '@uca/capability-schema';
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
import { inferenceSchema } from '@uca/capability-llm/schema';
import {
    SignalType as SchemaSignalType,
    type ErrorResult as SchemaError,
    type ValidatedResult,
} from '@uca/capability-schema/types';
import {
    __ID__,
    DEFAULT_CONFIGURATION,
    DUPLICATE_OPTIONS,
    INFERENCE_LIMITS,
    INVALID_PROBABILITIES,
    MAXIMUM_RETRIES,
    MISMATCHED_CORRELATION,
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
    requestSchema,
    resultSchema,
    type Body,
    type Configuration,
    type DecisionPayload,
    type Metadata,
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
            ...Decision.reactToSchema(),
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

    private static reactToSchema(): string[] {
        const {
            reactTo = [],
        } = Schema.disposition;
        return [
            ...reactTo,
            SchemaSignalType.VALIDATED,
            SchemaSignalType.ERROR,
        ];
    }

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
                Schema,
                {
                    ...Schema.disposition,
                    aim: {
                        description: Schema.AIM,
                        body: {
                            id: `${id}:schema`,
                        },
                    },
                },
            ],
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
            case SchemaSignalType.VALIDATED:
                this.handleSchemaValidated(signal);
                break;
            case SchemaSignalType.ERROR:
                this.handleSchemaError(signal);
                break;
            case LlmSignalType.INFERRED:
                this.handleLlmInferred(signal);
                break;
            case LlmSignalType.ERROR:
                this.handleLlmError(signal);
                break;
        }
    }

    private logDecisionRequest(value: unknown): void {
        const { correlationId, question, context } = (value ?? {}) as Request;
        const options = question?.options?.map(({ id, label }) => ({ id, label }));
        console.log('[DECISION::REQUEST]', { correlationId, prompt: question?.prompt, options, context });
    }

    private handleDecide(signal: Signal): void {
        const {
            value,
            source,
        } = signal;
        this.logDecisionRequest(value);
        this.pulse(SchemaSignalType.VALIDATE, {
            schema: requestSchema,
            value,
            context: {
                identity: value,
                replyTo: source,
            },
        });
    }

    private handleSchemaValidated(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            value: validated,
            context,
        } = value as ValidatedResult;
        const request = validated as Request;
        const {
            replyTo,
        } = context as ValidationContext;
        this.processValidatedRequest(request, replyTo);
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

    private handleSchemaError(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            error,
            context,
        } = value as SchemaError;
        const {
            identity,
            replyTo,
        } = context as ValidationContext;
        this.emitFailure(error, identity, replyTo);
    }

    private handleLlmInferred(signal: Signal): void {
        const {
            value,
        } = signal;
        const inferred = value as InferResult;
        const {
            metadata,
        } = inferred;
        this.processLlmInferred(inferred, metadata);
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

    private logDecisionResponse(decision: DecisionPayload, correlationId: string): void {
        const { choice, confidence, probabilities, assessment } = decision;
        console.log('[DECISION::RESPONSE]', { correlationId, choice, confidence, probabilities, assessment });
    }

    private emitDecided(decision: DecisionPayload, operation: Metadata): void {
        const { replyTo, request } = operation;
        const { correlationId, context } = request;
        this.logDecisionResponse(decision, correlationId);
        this.pulse(SignalType.DECIDED, {
            correlationId,
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
        const {
            question,
            context,
            correlationId,
        } = request;
        const config = this.resolveInferenceConfig();
        const payload = this.buildInferencePayload(request, outputSchema, replyTo, config);
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

    private buildInferencePayload(
        request: Request,
        outputSchema: Record<string, unknown>,
        replyTo: string,
        config: Configuration,
    ): Record<string, unknown> {
        const {
            question: {
                prompt,
                id,
                options,
                criteria,
            },
            context,
            correlationId,
        } = request;
        const criteriaMap = Object.fromEntries(
            options.map((opt) => [opt.id, opt.criteria ?? opt.description ?? opt.label ?? opt.id]),
        );
        return {
            ...config,
            purpose: Decision.purpose,
            goal: prompt,
            correlationId,
            outputSchema,
            contextSchema: {
                const: {
                    state: this.sanitizeEvaluationState(context),
                    question: {
                        id,
                        type: QuestionType.CHOICE,
                        instructions: prompt,
                        criteria: criteriaMap,
                    },
                },
            },
            limits: {
                ...this.disposition.limits,
                ...INFERENCE_LIMITS,
            },
            metadata: {
                request,
                replyTo,
                attempt: 0,
            },
        };
    }

    private sanitizeEvaluationState(context?: Record<string, unknown>): Record<string, unknown> {
        if (!context) {
            return {};
        }
        const {
            originalPayload,
            replyTo,
            ...state
        } = context;
        return state;
    }

    private validateInference(inferred: InferResult, operation: Metadata): DecisionPayload {
        const {
            request: sent,
            correlationId,
            data,
            response,
        } = inferred;
        const {
            request: {
                correlationId: expectedId,
                question: {
                    id: questionId,
                    options,
                },
                context,
            },
        } = operation;
        if (correlationId !== expectedId) {
            throw new Error(MISMATCHED_CORRELATION);
        }
        const payload = (data ?? JSON.parse(response ?? '')) as Record<string, unknown>;
        const answer = (payload[questionId] ?? payload) as Record<string, unknown>;
        const choiceResult = choiceResultSchema.parse(answer);
        return this.verifyChoice(choiceResult, questionId, options, context);
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
        context?: Record<string, unknown>,
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
            ...(context && {
                context,
            }),
        };
    }

    private recoverInference(inferred: InferResult | InferenceFailure, error: unknown, retry = true): void {
        const {
            metadata,
            request: sent,
            correlationId,
        } = inferred;
        const {
            data: operation,
        } = metadataSchema.safeParse(metadata);
        if (!operation) {
            this.emitFailure(MISSING_METADATA, { correlationId }, undefined, 1);
            return;
        }
        this.executeRecoveryAttempt(inferred, operation, sent, error, retry);
    }

    private executeRecoveryAttempt(
        inferred: InferResult | InferenceFailure,
        operation: Metadata,
        sent: unknown,
        error: unknown,
        retry: boolean,
    ): void {
        const {
            request,
            replyTo,
            attempt,
        } = operation;
        const {
            data: original,
        } = inferenceSchema.safeParse(sent);
        if (!retry || !original || attempt >= MAXIMUM_RETRIES) {
            this.emitFailure(error, request, replyTo, attempt + 1);
            return;
        }
        this.dispatchRecovery(inferred, original, operation, error);
    }

    private dispatchRecovery(
        inferred: InferResult | InferenceFailure,
        original: z.infer<typeof inferenceSchema>,
        operation: Metadata,
        error: unknown,
    ): void {
        const {
            attempt,
        } = operation;
        const {
            limits,
        } = original;
        const {
            data,
            response,
        } = inferred as InferResult;
        this.pulse(LlmSignalType.INFER, {
            ...original,
            metadata: {
                ...operation,
                attempt: attempt + 1,
            },
            limits: {
                ...limits,
                recovery: {
                    instruction: RECOVERY_INSTRUCTION,
                    rejected: data ?? response,
                    error: error instanceof Error ? error.message : String(error),
                },
            },
        });
    }

    private emitFailure(error: unknown, identity: unknown, replyTo?: string, attempts = 0): void {
        const {
            data,
        } = identitySchema.safeParse(identity);
        const {
            correlationId = null,
        } = data ?? {};
        this.pulse(SignalType.ERROR, {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            attempts,
        }, replyTo);
    }
}

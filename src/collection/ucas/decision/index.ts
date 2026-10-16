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
    INFERENCE_LIMITS,
    MAXIMUM_RETRIES,
    RECOVERY_INSTRUCTION,
    DUPLICATE_ITEMS,
    MISMATCHED_CORRELATION,
    UNKNOWN_SELECTION,
    INVALID_PROBABILITIES,
    PROBABILITY_TOLERANCE,
    MISSING_METADATA,
} from './constants.js';
import {
    requestSchema,
    resultSchema,
    configurationSchema,
    choiceSchema,
    probabilitySchema,
    metadataSchema,
    identitySchema,
    errorSchema,
} from './schema.js';
import {
    type Body,
    type Request,
    type Answers,
    type Metadata,
    type ValidationContext,
    DataType,
    Kind,
    QuestionType,
    SignalType,
} from './types.js';

export class Decision extends Uca<Body> {
    public static override purpose = 'Select one candidate according to the requested criterion with the lowest resource consumption and cost while meeting the required quality criteria';

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
        registry.forEach((capability) => capability.denervate());
        super.denervate();
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

    private handleDecide(signal: Signal): void {
        const {
            value,
            source,
        } = signal;
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
        try {
            const operation = metadataSchema.parse(metadata);
            const selectedId = this.validateInference(inferred, operation);
            const {
                replyTo,
                request: {
                    type,
                    correlationId,
                    context,
                    continuation,
                },
            } = operation;
            this.pulse(SignalType.DECIDED, {
                type,
                correlationId,
                result: {
                    selectedId,
                    context,
                    ...(continuation !== undefined && {
                        continuation,
                    }),
                },
            }, replyTo);
        }
        catch (error) {
            this.recoverInference(inferred, error);
        }
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
            items,
        } = request;
        const identifiers = items.map(({
            id,
        }) => id);
        if (new Set(identifiers).size !== items.length) {
            throw new Error(DUPLICATE_ITEMS);
        }
        const candidates = z.enum(identifiers);
        return z.toJSONSchema(z.object({
            selection: choiceSchema.extend({
                choice: candidates,
                probabilities: z.record(candidates, probabilitySchema),
            }),
        }).strict());
    }

    private sendInference(request: Request, outputSchema: Record<string, unknown>, replyTo: string): void {
        const {
            question,
            context,
            correlationId,
            items,
        } = request;
        const {
            aim: {
                body,
            },
            limits,
        } = this.disposition;
        const {
            configuration = DEFAULT_CONFIGURATION,
        } = body ?? {};
        const criteria = Object.fromEntries(items.map(({
            id,
            data,
        }) => [
            id,
            data,
        ]));
        this.pulse(LlmSignalType.INFER, {
            ...configurationSchema.parse(configuration),
            purpose: Decision.purpose,
            goal: question,
            correlationId,
            outputSchema,
            contextSchema: {
                const: {
                    state: context,
                    questions: {
                        selection: {
                            type: QuestionType.CHOICE,
                            instructions: question,
                            criteria,
                        },
                    },
                },
            },
            limits: {
                ...limits,
                ...INFERENCE_LIMITS,
            },
            metadata: {
                request,
                replyTo,
                attempt: 0,
            },
        });
    }

    private validateInference(inferred: InferResult, operation: Metadata): string {
        const {
            request: sent,
            correlationId,
            data,
            response,
        } = inferred;
        const {
            request: {
                correlationId: expectedCorrelationId,
                items,
            },
        } = operation;
        const {
            correlationId: sentCorrelationId,
            outputSchema,
        } = inferenceSchema.parse(sent);
        if (correlationId !== expectedCorrelationId || sentCorrelationId !== expectedCorrelationId) {
            throw new Error(MISMATCHED_CORRELATION);
        }
        const payload = data ?? JSON.parse(response ?? '');
        const {
            selection: {
                choice,
                probabilities,
            },
        } = z.fromJSONSchema(outputSchema).parse(payload) as Answers;
        if (!items.some(({
            id,
        }) => id === choice)) {
            throw new Error(UNKNOWN_SELECTION);
        }
        const total = Object.values(probabilities).reduce((sum, probability) => sum + probability, 0);
        if (Math.abs(total - 1) > PROBABILITY_TOLERANCE) {
            throw new Error(INVALID_PROBABILITIES);
        }
        return choice;
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
            this.emitFailure(MISSING_METADATA, {
                correlationId,
            }, undefined, 1);
            return;
        }
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
            type: Kind.SELECTION,
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            attempts,
        }, replyTo);
    }
}

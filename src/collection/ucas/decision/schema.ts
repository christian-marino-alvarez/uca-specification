import { z } from 'zod';
import { SignalType as LlmSignalType } from '@uca/capability-llm/types';
import { SignalType as SchemaSignalType } from '@uca/capability-schema/types';
import {
    Kind,
    QuestionType,
    RequirementState,
    SignalType,
    DataType,
} from './types.js';
import {
    MAXIMUM_CANDIDATES,
    MAXIMUM_RETRIES,
} from './constants.js';

export const itemSchema = z.object({
    id: z.string().min(1),
    data: z.record(z.string(), z.unknown()),
}).strict();

export const itemsSchema = z.array(itemSchema).min(1).max(MAXIMUM_CANDIDATES);

export const requestSchema = z.object({
    type: z.literal(Kind.CONSTRUCTION),
    question: z.string().min(1),
    context: z.record(z.string(), z.unknown()),
    continuation: z.unknown().optional(),
    correlationId: z.string().min(1),
    paths: itemsSchema,
    items: itemsSchema,
    selectionRequiresItems: z.array(z.string().min(1)),
}).strict();

export const resultSchema = z.object({
    type: z.literal(Kind.CONSTRUCTION),
    correlationId: z.string().min(1),
    result: z.object({
        path: z.string().min(1),
        requiredUcas: z.array(z.string().min(1)),
        context: z.record(z.string(), z.unknown()),
        continuation: z.unknown().optional(),
    }).strict(),
}).strict();

export const decisionPayloadSchema = resultSchema.shape.result.pick({
    path: true,
    requiredUcas: true,
});

export const probabilitySchema = z.number().min(0).max(1);

export const choiceSchema = z.object({
    type: z.literal(QuestionType.CHOICE),
    choice: z.string().min(1),
    probabilities: z.record(z.string().min(1), probabilitySchema),
    confidence: probabilitySchema,
}).strict();

export const requirementChoiceSchema = choiceSchema.extend({
    choice: z.enum(RequirementState),
    probabilities: z.record(
        z.enum(RequirementState),
        probabilitySchema,
    ),
});

// Local transport context; Llm does not send it to the backend.
export const metadataSchema = z.object({
    request: requestSchema,
    replyTo: z.string().min(1),
    attempt: z.number().int().min(0).max(MAXIMUM_RETRIES),
}).strict();

export const validationContextSchema = z.object({
    identity: z.unknown(),
    replyTo: z.string().min(1),
}).strict();

export const identitySchema = z.object({
    correlationId: z.string().min(1).optional(),
});

export const errorSchema = z.object({
    type: z.enum(Kind),
    correlationId: z.string().min(1).nullable(),
    error: z.string(),
    attempts: z.number().int().min(0).max(MAXIMUM_RETRIES + 1),
}).strict();

export const configurationSchema = z.object({
    provider: z.literal('jev'),
    model: z.string().min(1),
    limit: z.number().int().positive().optional(),
}).strict();

export const bodySchema = z.object({
    id: z.string().min(1).optional(),
    context: z.string().optional(),
    configuration: configurationSchema.optional(),
}).strict();

export const dispositionSchema = z.object({
    aim: z.object({
        description: z.string().min(1),
        body: bodySchema.optional(),
    }).strict(),
    reactTo: z.array(z.enum([
        SignalType.DECIDE,
        SchemaSignalType.VALIDATE,
        SchemaSignalType.VALIDATED,
        SchemaSignalType.ERROR,
        LlmSignalType.INFER,
        LlmSignalType.ABORT,
        LlmSignalType.INFERRED,
        LlmSignalType.ERROR,
    ])),
    inputs: z.tuple([
        z.object({
            signal: z.literal(SignalType.DECIDE),
            type: z.literal(DataType.REQUEST),
            schema: z.unknown().optional(),
            description: z.string().optional(),
        }).strict(),
    ]),
    outputs: z.tuple([
        z.object({
            signal: z.literal(SignalType.DECIDED),
            type: z.literal(DataType.RESULT),
            schema: z.unknown().optional(),
            description: z.string().optional(),
        }).strict(),
        z.object({
            signal: z.literal(SignalType.ERROR),
            type: z.literal(DataType.ERROR),
            schema: z.unknown().optional(),
            description: z.string().optional(),
        }).strict(),
    ]),
    limits: z.record(z.string(), z.unknown()).optional(),
}).strict();

export type Body = z.infer<typeof bodySchema>;
export type Configuration = z.infer<typeof configurationSchema>;
export type Item = z.infer<typeof itemSchema>;
export type Request = z.infer<typeof requestSchema>;
export type Result = z.infer<typeof resultSchema>;
export type ConstructionResult = z.infer<typeof resultSchema>;
export type ConstructionRequest = z.infer<typeof requestSchema>;
export type DecisionPayload = z.infer<typeof decisionPayloadSchema>;
export type Failure = z.infer<typeof errorSchema>;
export type Metadata = z.infer<typeof metadataSchema>;
export type ValidationContext = z.infer<typeof validationContextSchema>;

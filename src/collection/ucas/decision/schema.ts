import { z } from 'zod';
import {
    DataType,
    QuestionType,
    SignalType,
} from './types.js';
import {
    MAXIMUM_CANDIDATES,
    MAXIMUM_RETRIES,
} from './constants.js';

export const probabilitySchema = z.number().min(0).max(1);

export const optionItemSchema = z.object({
    id: z.string().min(1),
    label: z.string().optional(),
    description: z.string().optional(),
    criteria: z.string().optional(),
}).strict();

export const optionsSchema = z.array(
    optionItemSchema,
).min(2).max(MAXIMUM_CANDIDATES);

export const questionSchema = z.object({
    id: z.string().min(1),
    type: z.literal(QuestionType.CHOICE),
    prompt: z.string().min(1),
    options: optionsSchema,
    criteria: z.string().optional(),
}).strict();

export const requestSchema = z.object({
    correlationId: z.string().min(1),
    question: questionSchema,
    context: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
}).strict();

export const choiceResultSchema = z.object({
    assessment: z.string().optional(),
    choice: z.string().min(1),
    confidence: probabilitySchema,
    probabilities: z.record(
        z.string(),
        probabilitySchema,
    ),
}).passthrough();

export const decisionPayloadSchema = z.object({
    questionId: z.string().min(1),
    choice: z.string().min(1),
    confidence: probabilitySchema,
    probabilities: z.record(
        z.string(),
        probabilitySchema,
    ),
    assessment: z.string().optional(),
    context: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
}).passthrough();

export const resultSchema = z.object({
    correlationId: z.string().min(1),
    result: decisionPayloadSchema,
}).strict();

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

export type OptionItem = z.infer<typeof optionItemSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Request = z.infer<typeof requestSchema>;
export type ChoiceResult = z.infer<typeof choiceResultSchema>;
export type DecisionPayload = z.infer<typeof decisionPayloadSchema>;
export type Result = z.infer<typeof resultSchema>;
export type Failure = z.infer<typeof errorSchema>;
export type Metadata = z.infer<typeof metadataSchema>;
export type ValidationContext = z.infer<typeof validationContextSchema>;
export type Configuration = z.infer<typeof configurationSchema>;
export type Body = z.infer<typeof bodySchema>;


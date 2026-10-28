import { z } from 'zod';
import {
  QuestionType,
} from './types.js';
import {
  MAXIMUM_CANDIDATES,
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
  question: questionSchema,
  context: z.record(
    z.string(),
    z.unknown(),
  ).optional(),
}).passthrough();

export const choiceResultSchema = z.object({
  choice: z.string().min(1),
  confidence: probabilitySchema,
  probabilities: z.record(
    z.string(),
    probabilitySchema,
  ),
}).strict();

export const decisionPayloadSchema = z.object({
  questionId: z.string().min(1),
  choice: z.string().min(1),
  confidence: probabilitySchema,
  probabilities: z.record(
    z.string(),
    probabilitySchema,
  ),
}).strict();

export const resultSchema = z.object({
  result: decisionPayloadSchema,
  context: z.record(
    z.string(),
    z.unknown(),
  ).optional(),
}).passthrough();

export const errorSchema = z.object({
  error: z.string(),
}).strict();

export const bodySchema = z.object({
  id: z.string().min(1).optional(),
  context: z.string().optional(),
  source: z.string().optional(),
  replyTo: z.string().optional(),
  imagination: z.number().min(0).max(1).optional(),
  limit: z.number().int().positive().optional(),
  question: questionSchema.optional(),
  requestContext: z.record(
    z.string(),
    z.unknown(),
  ).optional(),
  result: decisionPayloadSchema.optional(),
}).strict();

export type OptionItem = z.infer<typeof optionItemSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Request = z.infer<typeof requestSchema>;
export type ChoiceResult = z.infer<typeof choiceResultSchema>;
export type DecisionPayload = z.infer<typeof decisionPayloadSchema>;
export type Result = z.infer<typeof resultSchema>;
export type Failure = z.infer<typeof errorSchema>;
export type Body = z.infer<typeof bodySchema>;

import { z } from 'zod';
import { specificationModelSchema } from '@uca/capability-specification/schema';
import { decisionPayloadSchema } from '@uca/decision/schema';

export const choiceSchema = z.enum([
  'LAYOUT',
  'VIEW',
]);


export const areaTargetSchema = z.object({
  id: z.string().min(1),
  parentId: z.string().optional(),
  purpose: z.string().optional(),
  intention: z.string().optional(),
  qualities: z.record(
    z.string(),
    z.unknown(),
  ).optional(),
  dimensions: z.record(
    z.string(),
    z.unknown(),
  ).optional(),
  limits: z.array(z.string().min(1)).optional(),
}).strict();

export const composeRequestSchema = z.object({
  url: z.string().min(1).optional(),
  area: areaTargetSchema.optional(),
}).passthrough();

export const errorPayloadSchema = z.object({
  error: z.string(),
}).passthrough();

export const bodySchema = z.object({
  id: z.string().optional(),
  context: z.string().optional(),
  source: z.string().optional(),
  url: z.string().optional(),
  area: areaTargetSchema.optional(),
  browser: z.record(
    z.string(),
    z.unknown(),
  ).optional(),
  choice: choiceSchema.optional(),
  decision: decisionPayloadSchema.optional(),
  specification: specificationModelSchema.optional(),
}).strict();

export type Choice = z.infer<typeof choiceSchema>;
export type AreaTarget = z.infer<typeof areaTargetSchema>;
export type ComposeRequest = z.infer<typeof composeRequestSchema>;
export type ErrorPayload = z.infer<typeof errorPayloadSchema>;
export type Body = z.infer<typeof bodySchema>;

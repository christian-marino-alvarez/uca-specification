import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const toneSchema = z.enum([
  'neutral',
  'success',
  'warning',
  'error',
  'info',
]);

export const bodySchema = z.object({
  purpose: z.string().optional(),
  intention: z.string().optional(),
  id: z.string().optional(),
  context: z.string().optional(),
  elementId: z.string().optional(),
  parentTo: z.string().optional(),
  content: z.string().optional(),
  text: z.string().optional(),
  label: z.string().optional(),
  title: z.string().optional(),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
  ]).optional(),
  tone: toneSchema.optional(),
  qualities: qualitiesSchema,
  events: z.array(z.string()).optional(),
  source: z.string().optional(),
});

export const inferenceSchema = z.object({
  content: z.string().min(1).describe('Texto conciso de la insignia de estado en español coherente con purpose e intention'),
  tone: toneSchema.describe('Tono semántico del estado (neutral, success, warning, error, info)'),
});

export const eventContextSchema = z.object({
  elementId: z.string(),
  event: z.string(),
  action: z.string().optional(),
  value: z.unknown().optional(),
  checked: z.boolean().optional(),
  detail: z.unknown().optional(),
  context: z.unknown().optional(),
});

export const errorSchema = z.unknown();

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;
export type EventContext = z.infer<typeof eventContextSchema>;

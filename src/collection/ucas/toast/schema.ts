import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const toneSchema = z.enum([
  'info',
  'success',
  'warning',
  'error',
]);

export const bodySchema = z.object({
  purpose: z.string().optional(),
  intention: z.string().optional(),
  id: z.string().optional(),
  context: z.string().optional(),
  elementId: z.string().optional(),
  parentTo: z.string().optional(),
  content: z.string().optional(),
  message: z.string().optional(),
  actionLabel: z.string().optional(),
  icon: z.string().optional(),
  tone: toneSchema.optional(),
  duration: z.number().int().positive().optional(),
  open: z.boolean().optional(),
  qualities: qualitiesSchema,
  events: z.array(z.string()).optional(),
  source: z.string().optional(),
});

export const inferenceSchema = z.object({
  message: z.string().min(1).describe('Mensaje breve de notificación emergente en español coherente con purpose e intention'),
  actionLabel: z.string().optional().describe('Etiqueta opcional de acción rápida dentro de la notificación en español'),
  tone: toneSchema.describe('Tono semántico de la notificación (info, success, warning, error)'),
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
export type Tone = z.infer<typeof toneSchema>;
export type Body = z.infer<typeof bodySchema>;
export type EventContext = z.infer<typeof eventContextSchema>;

import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const progressVariantSchema = z.enum([
  'linear',
  'circular',
]);

export const bodySchema = z.object({
  purpose: z.string().optional(),
  intention: z.string().optional(),
  id: z.string().optional(),
  context: z.string().optional(),
  elementId: z.string().optional(),
  parentTo: z.string().optional(),
  label: z.string().optional(),
  value: z.number().nonnegative().optional(),
  total: z.number().positive().optional(),
  variant: progressVariantSchema.optional(),
  indeterminate: z.boolean().optional(),
  qualities: qualitiesSchema,
  events: z.array(z.string()).optional(),
  source: z.string().optional(),
});

export const inferenceSchema = z.object({
  label: z.string().min(1).describe('Etiqueta descriptiva de la métrica de progreso en español coherente con purpose e intention'),
  value: z.number().min(0).max(100).describe('Valor actual del indicador de progreso dentro del rango de la métrica'),
  total: z.number().positive().describe('Valor total o máximo de referencia de la métrica (por defecto 100)'),
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

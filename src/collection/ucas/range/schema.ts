import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const bodySchema = z.object({
  purpose: z.string().optional(),
  intention: z.string().optional(),
  id: z.string().optional(),
  context: z.string().optional(),
  elementId: z.string().optional(),
  parentTo: z.string().optional(),
  name: z.string().optional(),
  action: z.string().optional(),
  label: z.string().optional(),
  value: z.number().optional(),
  minimum: z.number().optional(),
  maximum: z.number().optional(),
  step: z.number().positive().optional(),
  disabled: z.boolean().optional(),
  required: z.boolean().optional(),
  qualities: qualitiesSchema,
  events: z.array(z.string()).optional(),
  source: z.string().optional(),
});

export const inferenceSchema = z.object({
  label: z.string().min(1).describe('Etiqueta descriptiva del rango continuo en español coherente con purpose e intention'),
  minimum: z.number().describe('Cota mínima de la escala del rango'),
  maximum: z.number().describe('Cota máxima de la escala del rango'),
  step: z.number().positive().describe('Incremento discreto entre valores del rango'),
  value: z.number().describe('Valor numérico seleccionado inicialmente dentro del intervalo [minimum, maximum]'),
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

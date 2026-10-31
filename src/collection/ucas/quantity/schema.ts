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
  unit: z.string().optional(),
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
  label: z.string().min(1).describe('Etiqueta descriptiva de la magnitud numérica en español coherente con purpose e intention'),
  value: z.number().describe('Valor numérico inicial coherente con la intención funcional'),
  unit: z.string().min(1).describe('Unidad de medida de la magnitud (ej. ms, px, %, nodos, tokens)'),
  minimum: z.number().describe('Límite inferior permitido para la magnitud'),
  maximum: z.number().describe('Límite superior permitido para la magnitud'),
  step: z.number().positive().describe('Incremento por paso de ajuste numérico'),
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

import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const itemSchema = z.object({
  value: z.string(),
  label: z.string(),
  selected: z.boolean().optional(),
  disabled: z.boolean().optional(),
});

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
  placeholder: z.string().optional(),
  value: z.string().optional(),
  items: z.array(z.union([
    z.string(),
    itemSchema,
  ])).optional(),
  disabled: z.boolean().optional(),
  required: z.boolean().optional(),
  qualities: qualitiesSchema,
  events: z.array(z.string()).optional(),
  source: z.string().optional(),
});

export const inferenceSchema = z.object({
  label: z.string().min(1).describe('Etiqueta accesible del selector de opciones en español'),
  items: z.array(itemSchema).min(2).describe('Lista de opciones seleccionables (mínimo 2) con value y label en español coherentes con purpose e intention'),
  value: z.string().min(1).describe('Valor de la opción seleccionada inicialmente (debe coincidir con el value de uno de los items)'),
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
export type Item = z.infer<typeof itemSchema>;
export type Body = z.infer<typeof bodySchema>;
export type EventContext = z.infer<typeof eventContextSchema>;

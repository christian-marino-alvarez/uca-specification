import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const sliderVariantSchema = z.enum([
  'continuous',
  'discrete',
]);

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
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().positive().optional(),
  variant: sliderVariantSchema.optional(),
  disabled: z.boolean().optional(),
  showValueIndicator: z.boolean().optional(),
  qualities: qualitiesSchema,
  events: z.array(z.string()).optional(),
  source: z.string().optional(),
});

export const inferenceSchema = z.object({
  label: z.string().min(1).describe('Etiqueta descriptiva del control deslizante en español coherente con purpose e intention'),
  min: z.number().describe('Valor mínimo de la escala del control deslizante'),
  max: z.number().describe('Valor máximo de la escala del control deslizante'),
  step: z.number().positive().describe('Incremento por paso del control deslizante'),
  value: z.number().describe('Valor inicial posicionado dentro del rango [min, max]'),
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
export type SliderVariant = z.infer<typeof sliderVariantSchema>;
export type Body = z.infer<typeof bodySchema>;
export type EventContext = z.infer<typeof eventContextSchema>;

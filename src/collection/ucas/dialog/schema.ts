import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const dialogVariantSchema = z.enum([
  'basic',
  'confirmation',
  'fullscreen',
]);

export const bodySchema = z.object({
  purpose: z.string().optional(),
  intention: z.string().optional(),
  id: z.string().optional(),
  context: z.string().optional(),
  elementId: z.string().optional(),
  parentTo: z.string().optional(),
  icon: z.string().optional(),
  headline: z.string().optional(),
  supportingText: z.string().optional(),
  content: z.string().optional(),
  confirmLabel: z.string().optional(),
  cancelLabel: z.string().optional(),
  variant: dialogVariantSchema.optional(),
  open: z.boolean().optional(),
  qualities: qualitiesSchema,
  events: z.array(z.string()).optional(),
  source: z.string().optional(),
});

export const inferenceSchema = z.object({
  headline: z.string().min(1).describe('Titular principal del diálogo en español coherente con purpose e intention'),
  supportingText: z.string().min(1).describe('Texto explicativo de soporte del diálogo en español'),
  confirmLabel: z.string().min(1).describe('Etiqueta de la acción de confirmación en español'),
  cancelLabel: z.string().min(1).describe('Etiqueta de la acción secundaria o cancelación en español'),
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
export type DialogVariant = z.infer<typeof dialogVariantSchema>;
export type Body = z.infer<typeof bodySchema>;
export type EventContext = z.infer<typeof eventContextSchema>;

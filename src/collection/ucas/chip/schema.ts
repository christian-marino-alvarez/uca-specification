import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const chipVariantSchema = z.enum([
  'assist',
  'filter',
  'input',
  'suggestion',
]);

export const bodySchema = z.object({
  purpose: z.string().optional(),
  intention: z.string().optional(),
  id: z.string().optional(),
  context: z.string().optional(),
  elementId: z.string().optional(),
  parentTo: z.string().optional(),
  content: z.string().optional(),
  label: z.string().optional(),
  text: z.string().optional(),
  title: z.string().optional(),
  leadingIcon: z.string().optional(),
  trailingIcon: z.string().optional(),
  variant: chipVariantSchema.optional(),
  selected: z.boolean().optional(),
  removable: z.boolean().optional(),
  disabled: z.boolean().optional(),
  qualities: qualitiesSchema,
  events: z.array(z.string()).optional(),
  source: z.string().optional(),
});

export const inferenceSchema = z.object({
  content: z.string().min(1).describe('Texto visible conciso de la píldora (chip) en español coherente con purpose e intention'),
  variant: chipVariantSchema.describe('Variante funcional de la píldora en Material Design 3'),
  selected: z.boolean().describe('Estado inicial de selección de la píldora según la intención funcional'),
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
export type ChipVariant = z.infer<typeof chipVariantSchema>;
export type Body = z.infer<typeof bodySchema>;
export type EventContext = z.infer<typeof eventContextSchema>;

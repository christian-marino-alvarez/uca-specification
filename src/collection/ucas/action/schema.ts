import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const actionTypeSchema = z.enum([
  'button',
  'submit',
  'reset',
]);

export const actionVariantSchema = z.enum([
  'elevated',
  'filled',
  'tonal',
  'outlined',
  'text',
  'icon',
]);

export const iconPositionSchema = z.enum([
  'leading',
  'trailing',
]);

export const bodySchema = z.object({
  purpose: z.string().optional(),
  intention: z.string().optional(),
  id: z.string().optional(),
  context: z.string().optional(),
  elementId: z.string().optional(),
  parentTo: z.string().optional(),
  label: z.string().optional(),
  content: z.string().optional(),
  text: z.string().optional(),
  title: z.string().optional(),
  action: z.string().optional(),
  type: actionTypeSchema.optional(),
  variant: actionVariantSchema.optional(),
  icon: z.string().optional(),
  iconPosition: iconPositionSchema.optional(),
  disabled: z.boolean().optional(),
  qualities: qualitiesSchema,
  events: z.array(z.string()).optional(),
  source: z.string().optional(),
});

export const inferenceSchema = z.object({
  content: z.string().min(1).describe('Etiqueta visible del botón de acción en español (verbo o comando conciso coherente con purpose e intention)'),
  action: z.string().min(1).describe('Identificador semántico en kebab-case de la operación que dispara el botón'),
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

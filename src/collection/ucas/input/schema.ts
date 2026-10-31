import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const inputTypeSchema = z.enum([
  'text',
  'email',
  'password',
  'search',
  'tel',
  'url',
  'number',
]);

export const inputVariantSchema = z.enum([
  'filled',
  'outlined',
]);

export const bodySchema = z.object({
  purpose: z.string().optional(),
  intention: z.string().optional(),
  id: z.string().optional(),
  context: z.string().optional(),
  elementId: z.string().optional(),
  parentTo: z.string().optional(),
  type: inputTypeSchema.optional(),
  name: z.string().optional(),
  value: z.string().optional(),
  placeholder: z.string().optional(),
  label: z.string().optional(),
  supportingText: z.string().optional(),
  leadingIcon: z.string().optional(),
  trailingIcon: z.string().optional(),
  variant: inputVariantSchema.optional(),
  error: z.boolean().optional(),
  action: z.string().optional(),
  autocomplete: z.string().optional(),
  disabled: z.boolean().optional(),
  readonly: z.boolean().optional(),
  required: z.boolean().optional(),
  qualities: qualitiesSchema,
  events: z.array(z.string()).optional(),
  source: z.string().optional(),
});

export const inferenceSchema = z.object({
  label: z.string().min(1).describe('Etiqueta descriptiva del campo de entrada en español'),
  placeholder: z.string().min(1).describe('Texto guía (placeholder) en español que indica qué introducir en el campo'),
  value: z.string().describe('Valor inicial del campo de entrada (cadena vacía si espera entrada del usuario)'),
  type: inputTypeSchema.describe('Tipo semántico del campo de entrada'),
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

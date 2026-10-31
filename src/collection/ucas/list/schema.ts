import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const listItemSchema = z.object({
  id: z.string().optional(),
  content: z.string().optional(),
  text: z.string().optional(),
  qualities: qualitiesSchema,
});

export const bodySchema = z.object({
  purpose: z.string().optional(),
  intention: z.string().optional(),
  id: z.string().optional(),
  context: z.string().optional(),
  elementId: z.string().optional(),
  parentTo: z.string().optional(),
  content: z.string().optional(),
  items: z.array(z.union([
    z.string(),
    listItemSchema,
  ])).optional(),
  ordered: z.boolean().optional(),
  qualities: qualitiesSchema,
  events: z.array(z.string()).optional(),
  source: z.string().optional(),
});

export const inferenceSchema = z.object({
  items: z.array(z.string().min(1)).min(2).describe('Elementos textuales de la lista en español coherentes con purpose e intention'),
  ordered: z.boolean().describe('Indica si la secuencia de elementos es numerada/ordenada (true) o no ordenada (false)'),
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
export type ListItem = z.infer<typeof listItemSchema>;
export type Body = z.infer<typeof bodySchema>;
export type EventContext = z.infer<typeof eventContextSchema>;

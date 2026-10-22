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
    elementId: z.string().optional(),
    parentTo: z.string().optional(),
    containerElement: z.string().optional(),
    items: z.array(z.union([z.string(), listItemSchema])).optional(),
    ordered: z.boolean().optional(),
    qualities: qualitiesSchema,
    events: z.array(z.string()).optional(),
    context: z.unknown().optional(),
}).strict();

export type Qualities = z.infer<typeof qualitiesSchema>;
export type ListItem = z.infer<typeof listItemSchema>;
export type Body = z.infer<typeof bodySchema>;

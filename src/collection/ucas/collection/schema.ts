import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const bodySchema = z.object({
    elementId: z.string().optional(),
    parentTo: z.string().optional(),
    containerElement: z.string().optional(),
    content: z.string().optional(),
    name: z.string().optional(),
    action: z.string().optional(),
    method: z.enum(['get', 'post', 'dialog']).optional(),
    autocomplete: z.enum(['on', 'off']).optional(),
    novalidate: z.boolean().optional(),
    qualities: qualitiesSchema,
    events: z.array(z.string()).optional(),
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;

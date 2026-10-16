import { z } from 'zod';

import { qualitiesSchema as controlQualitiesSchema } from '@uca/capability-css/schema';
export const qualitiesSchema = controlQualitiesSchema.optional();

export const bodySchema = z.object({
    elementId: z.string().optional(),
    parentTo: z.string().optional(),
    containerElement: z.string().optional(),
    label: z.string().optional(),
    content: z.string().optional(),
    action: z.string().optional(),
    type: z.enum(['button', 'submit', 'reset']).optional(),
    disabled: z.boolean().optional(),
    qualities: qualitiesSchema,
    events: z.array(z.string()).optional(),
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;

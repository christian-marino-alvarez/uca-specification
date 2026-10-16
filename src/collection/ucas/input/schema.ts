import { z } from 'zod';

import { qualitiesSchema as controlQualitiesSchema } from '@uca/capability-css/schema';
export const qualitiesSchema = controlQualitiesSchema.optional();

export const bodySchema = z.object({
    elementId: z.string().optional(),
    parentTo: z.string().optional(),
    containerElement: z.string().optional(),
    type: z.enum(['text', 'email', 'password', 'search', 'tel', 'url', 'number']).optional(),
    name: z.string().optional(),
    value: z.string().optional(),
    placeholder: z.string().optional(),
    action: z.string().optional(),
    autocomplete: z.string().optional(),
    disabled: z.boolean().optional(),
    readonly: z.boolean().optional(),
    required: z.boolean().optional(),
    qualities: qualitiesSchema,
    events: z.array(z.string()).optional(),
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;

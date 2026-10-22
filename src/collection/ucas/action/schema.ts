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

export const renderPayloadSchema = bodySchema.refine(
    (data) => Boolean((data.label && data.label.trim().length > 0) || (data.content && data.content.trim().length > 0)),
    {
        message: 'Action requires a non-empty label or content',
    },
);

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;
export type RenderPayload = z.infer<typeof renderPayloadSchema>;

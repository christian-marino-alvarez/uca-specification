import { z } from 'zod';
import { identitySchema } from '../schema.js';

export const bodySchema = identitySchema.extend({
    label: z.string().optional(),
    value: z.number().optional(),
    unit: z.string().optional(),
    minimum: z.number().optional(),
    maximum: z.number().optional(),
    step: z.number().positive().optional(),
    disabled: z.boolean().optional(),
});

export const qualitiesSchema = identitySchema.shape.qualities;

export const renderPayloadSchema = bodySchema.required({
    value: true,
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;
export type RenderPayload = z.infer<typeof renderPayloadSchema>;

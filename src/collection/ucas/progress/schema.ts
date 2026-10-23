import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';
import { identitySchema } from '../schema.js';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const bodySchema = identitySchema.extend({
    label: z.string().optional(),
    value: z.number().nonnegative().optional(),
    total: z.number().positive().optional(),
    variant: z.enum(['linear', 'circular']).optional().describe('Material Design 3 progress indicator variant (linear, circular)'),
    indeterminate: z.boolean().optional().describe('Continuous indeterminate loading animation'),
});

export const renderPayloadSchema = bodySchema.required({
    value: true,
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;
export type RenderPayload = z.infer<typeof renderPayloadSchema>;


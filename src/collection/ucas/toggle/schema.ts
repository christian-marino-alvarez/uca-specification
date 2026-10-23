import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';
import { identitySchema } from '../schema.js';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const bodySchema = identitySchema.extend({
    label: z.string().optional(),
    value: z.boolean().optional(),
    disabled: z.boolean().optional(),
    variant: z.enum(['switch', 'checkbox']).optional().describe('Material Design 3 selection control variant (switch, checkbox)'),
});

export const renderPayloadSchema = bodySchema.required({
    label: true,
}).extend({
    label: z.string().min(1),
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;
export type RenderPayload = z.infer<typeof renderPayloadSchema>;


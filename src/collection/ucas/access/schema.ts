import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';
import { identitySchema } from '../schema.js';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const bodySchema = identitySchema.extend({
    text: z.string().optional().describe('Visible anchor text or accessible link label'),
    destination: z.string().optional().describe('Target URI or anchor destination'),
    description: z.string().optional().describe('Accessible description or purpose of the link'),
});

export const renderPayloadSchema = bodySchema.required({
    text: true,
    destination: true,
}).extend({
    text: z.string().min(1, 'Text is required for access link'),
    destination: z.string().min(1, 'Destination is required for access link'),
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;
export type RenderPayload = z.infer<typeof renderPayloadSchema>;


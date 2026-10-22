import { Tone } from './types.js';
import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';
import { identitySchema } from '../schema.js';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const bodySchema = identitySchema.extend({
    text: z.string().optional(),
    tone: z.enum(Tone).optional(),
});

export const renderPayloadSchema = bodySchema.required({
    text: true,
}).extend({
    text: z.string().min(1),
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;
export type RenderPayload = z.infer<typeof renderPayloadSchema>;


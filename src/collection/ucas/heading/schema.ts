import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';
import { identitySchema } from '../schema.js';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const bodySchema = identitySchema.extend({
    text: z.string().optional(),
    importance: z.number().int().min(1).max(6).optional(),
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;


import { Orientation } from './types.js';
import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';
import { identitySchema } from '../schema.js';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const bodySchema = identitySchema.extend({
    description: z.string().optional(),
    orientation: z.enum(Orientation).optional(),
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;


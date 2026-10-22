import { z } from 'zod';
import { identitySchema } from '../schema.js';

export const bodySchema = identitySchema.extend({
    label: z.string().optional(),
    value: z.iso.date().optional(),
    minimum: z.iso.date().optional(),
    maximum: z.iso.date().optional(),
    disabled: z.boolean().optional(),
});

export const qualitiesSchema = identitySchema.shape.qualities;
export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;

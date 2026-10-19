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

export type Body = z.infer<typeof bodySchema>;

import { z } from 'zod';
import { identitySchema } from '../schema.js';

export const bodySchema = identitySchema.extend({
    label: z.string().optional(),
    value: z.number().nonnegative().optional(),
    total: z.number().positive().optional(),
});

export type Body = z.infer<typeof bodySchema>;

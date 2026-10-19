import { z } from 'zod';
import { identitySchema } from '../schema.js';

export const bodySchema = identitySchema.extend({
    label: z.string().optional(),
    value: z.boolean().optional(),
    disabled: z.boolean().optional(),
});

export type Body = z.infer<typeof bodySchema>;

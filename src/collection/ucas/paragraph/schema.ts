import { z } from 'zod';
import { identitySchema } from '../schema.js';

export const bodySchema = identitySchema.extend({
    text: z.string().optional(),
});

export type Body = z.infer<typeof bodySchema>;

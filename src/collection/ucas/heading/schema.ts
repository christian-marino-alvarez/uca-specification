import { z } from 'zod';
import { identitySchema } from '../schema.js';

export const bodySchema = identitySchema.extend({
    text: z.string().optional(),
    importance: z.number().int().min(1).max(6).optional(),
});

export type Body = z.infer<typeof bodySchema>;

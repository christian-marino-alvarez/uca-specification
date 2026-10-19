import { Tone } from './types.js';
import { z } from 'zod';
import { identitySchema } from '../schema.js';

export const bodySchema = identitySchema.extend({
    text: z.string().optional(),
    tone: z.enum(Tone).optional(),
});

export type Body = z.infer<typeof bodySchema>;

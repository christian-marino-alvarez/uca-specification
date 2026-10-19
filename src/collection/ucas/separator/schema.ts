import { Orientation } from './types.js';
import { z } from 'zod';
import { identitySchema } from '../schema.js';

export const bodySchema = identitySchema.extend({
    description: z.string().optional(),
    orientation: z.enum(Orientation).optional(),
});

export type Body = z.infer<typeof bodySchema>;

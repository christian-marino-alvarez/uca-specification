import { z } from 'zod';
import { Kind } from './types.js';

export const bodySchema = z.object({
    id: z.string().optional(),
    kind: z.enum(Kind).optional(),
});

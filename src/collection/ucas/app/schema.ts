import { z } from 'zod';
import { structureSchema } from '@uca/composer/schema';

export const bodySchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    version: z.string().optional(),
    environment: z.string().optional(),
    context: z.string().optional(),
    composition: structureSchema.optional(),
});

export type Body = z.infer<typeof bodySchema>;

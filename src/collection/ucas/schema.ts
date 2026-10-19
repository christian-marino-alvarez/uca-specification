import { z } from 'zod';
import { qualitiesSchema } from '@uca/capability-css/schema';

export const identitySchema = z.object({
    elementId: z.string().min(1).optional(),
    parentId: z.string().min(1).optional(),
    parentTo: z.string().optional(),
    containerElement: z.string().optional(),
    qualities: qualitiesSchema.optional(),
    context: z.unknown().optional(),
});

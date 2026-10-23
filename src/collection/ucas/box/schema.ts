import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const bodySchema = z.object({
    elementId: z.string().optional(),
    parentTo: z.string().optional(),
    content: z.string().optional(),
    containerElement: z.string().optional(),
    variant: z.enum(['elevated', 'filled', 'outlined']).optional().describe('Material Design 3 containment variant'),
    qualities: qualitiesSchema,
    events: z.array(z.string()).optional(),
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;

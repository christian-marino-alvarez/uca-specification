import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const bodySchema = z.object({
    elementId: z.string().optional(),
    parentTo: z.string().optional(),
    containerElement: z.string().optional(),
    src: z.string().min(1).describe('Source URI or data URI of the image'),
    alt: z.string().optional().describe('Alternative description for accessibility'),
    loading: z.enum(['lazy', 'eager']).optional().describe('Native image loading strategy'),
    aspectRatio: z.string().optional().describe('Aspect ratio constraint'),
    qualities: qualitiesSchema,
    context: z.unknown().optional(),
}).strict();

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;

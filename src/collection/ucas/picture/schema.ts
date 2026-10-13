import { z } from 'zod';

export const qualitiesSchema = z.object({
    width: z.string().optional(),
    height: z.string().optional(),
    spacing: z.string().optional(),
    surface: z.string().optional(),
    tone: z.string().optional(),
    elevation: z.string().optional(),
    radius: z.string().optional(),
    custom: z.record(z.string(), z.string()).optional(),
}).optional();

export const bodySchema = z.object({
    elementId: z.string().optional(),
    parentTo: z.string().optional(),
    containerElement: z.string().optional(),
    src: z.string().min(1).describe('Source URI or data URI of the image'),
    alt: z.string().optional().describe('Alternative description for accessibility'),
    loading: z.enum(['lazy', 'eager']).optional().describe('Native image loading strategy'),
    aspectRatio: z.string().optional().describe('Aspect ratio ratio constraint'),
    qualities: qualitiesSchema,
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;

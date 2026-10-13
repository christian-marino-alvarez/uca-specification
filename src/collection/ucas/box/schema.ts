import { z } from 'zod';

export const qualitiesSchema = z.object({
    width: z.string().optional(),
    height: z.string().optional(),
    spacing: z.string().optional(),
    gap: z.string().optional(),
    surface: z.string().optional(),
    tone: z.string().optional(),
    typeface: z.string().optional(),
    textSize: z.string().optional(),
    elevation: z.string().optional(),
    radius: z.string().optional(),
    border: z.string().optional(),
    direction: z.string().optional(),
    alignment: z.string().optional(),
    custom: z.record(z.string(), z.string()).optional(),
}).optional();

export const bodySchema = z.object({
    elementId: z.string().optional(),
    parentTo: z.string().optional(),
    content: z.string().optional(),
    containerElement: z.string().optional(),
    qualities: qualitiesSchema,
    events: z.array(z.string()).optional(),
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;

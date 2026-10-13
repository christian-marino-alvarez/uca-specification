import { z } from 'zod';

export const screenSchema = z.object({
    width: z.number().optional(),
    height: z.number().optional(),
    availWidth: z.number().optional(),
    availHeight: z.number().optional(),
    colorDepth: z.number().optional(),
    pixelRatio: z.number().optional(),
    orientation: z.string().optional(),
}).optional();

export const dimensionsSchema = z.object({
    width: z.number().optional(),
    height: z.number().optional(),
    pixelRatio: z.number().optional(),
    orientation: z.string().optional(),
    screen: screenSchema,
}).optional();

export const bodySchema = z.object({
    name: z.string().default('App'),
    purpose: z.string().optional(),
    context: z.string().optional(),
    language: z.string().default('es-ES'),
    dimensions: dimensionsSchema,
});

export type Screen = z.infer<typeof screenSchema>;
export type Dimensions = z.infer<typeof dimensionsSchema>;
export type Body = z.infer<typeof bodySchema>;

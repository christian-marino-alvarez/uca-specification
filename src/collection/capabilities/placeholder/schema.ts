import { z } from 'zod';

export const dimensionSchema = z.union([
    z.string(),
    z.number(),
]);

export const dimensionsSchema = z.object({
    width: dimensionSchema.optional(),
    height: dimensionSchema.optional(),
    maxWidth: dimensionSchema.optional(),
    minWidth: dimensionSchema.optional(),
    minHeight: dimensionSchema.optional(),
}).strict();

export const requestSchema = z.object({
    areaId: z.string().min(1),
    kind: z.string().min(1).optional(),
    dimensions: dimensionsSchema.optional(),
    appearance: z.object({
        colorScheme: z.enum([
            'light',
            'dark',
            'no-preference',
        ]),
        reducedMotion: z.boolean(),
    }).strict().optional(),
    context: z.unknown().optional(),
}).strict();

export const resultSchema = z.object({
    areaId: z.string().min(1),
    source: z.string().min(1),
    context: z.unknown().optional(),
}).strict();

export const errorSchema = z.object({
    areaId: z.string().min(1).nullable(),
    error: z.string(),
    context: z.unknown().optional(),
}).strict();

export const shapeSchema = z.object({
    height: z.number().positive(),
    elements: z.string().min(1),
}).strict();

export const bodySchema = z.object({
    id: z.string().min(1).optional(),
}).strict();

export type Body = z.infer<typeof bodySchema>;
export type Dimensions = z.infer<typeof dimensionsSchema>;
export type ErrorResult = z.infer<typeof errorSchema>;
export type Request = z.infer<typeof requestSchema>;
export type Result = z.infer<typeof resultSchema>;
export type Shape = z.infer<typeof shapeSchema>;

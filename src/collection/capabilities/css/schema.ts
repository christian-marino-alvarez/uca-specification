import { z } from 'zod';

export const designTokenSchema = z.object({
    $value: z.unknown(),
    $type: z.string().optional(),
    $description: z.string().optional(),
});

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
});

export const baseRulesSchema = z.object({
    body: z.record(z.string(), z.string()),
    app: z.record(z.string(), z.string()),
    customElement: z.record(z.string(), z.string()),
});

export const bodySchema = z.object({
    qualities: qualitiesSchema.optional(),
    tokens: z.record(z.string(), z.record(z.string(), z.unknown())).optional(),
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type BaseRules = z.infer<typeof baseRulesSchema>;
export type Body = z.infer<typeof bodySchema>;

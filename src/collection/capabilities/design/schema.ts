import { z } from 'zod';

export const themeSchema = z.enum([
    'dark',
    'light',
    'system',
]);

export const themePayloadSchema = z.object({
    theme: themeSchema,
}).strict();

export const resolvePayloadSchema = z.object({
    category: z.string().min(1),
    token: z.string().min(1),
}).strict();

export const resolvedResultSchema = z.object({
    category: z.string().min(1),
    token: z.string().min(1),
    value: z.unknown(),
}).strict();

export const designTokenSchema = z.object({
    $value: z.unknown(),
    $type: z.string().optional(),
    $description: z.string().optional(),
}).strict();

export const designTokensSchema = z.record(
    z.string(),
    z.record(
        z.string(),
        designTokenSchema,
    ),
);

export const designSpecificationSchema = z.object({
    theme: themeSchema,
    variant: z.string().optional(),
    tokens: designTokensSchema.optional(),
}).strict();

export const bodySchema = z.object({
    id: z.string().optional(),
    theme: themeSchema.optional(),
    variant: z.string().optional(),
    tokens: designTokensSchema.optional(),
}).strict();

export type Theme = z.infer<typeof themeSchema>;
export type ThemePayload = z.infer<typeof themePayloadSchema>;
export type ResolvePayload = z.infer<typeof resolvePayloadSchema>;
export type ResolvedResult = z.infer<typeof resolvedResultSchema>;
export type DesignToken = z.infer<typeof designTokenSchema>;
export type DesignTokens = z.infer<typeof designTokensSchema>;
export type DesignSpecification = z.infer<typeof designSpecificationSchema>;
export type Body = z.infer<typeof bodySchema>;

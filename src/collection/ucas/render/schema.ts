import { z } from 'zod';

export const renderModeSchema = z.enum([
    'deterministic',
    'inference',
]);

export const layoutAreaSchema = z.object({
    id: z.string().min(1),
    parentId: z.string().optional(),
    role: z.string().optional(),
    proportion: z.string().optional(),
    description: z.string().optional(),
    skeletonKind: z.string().optional(),
    content: z.string().optional(),
    qualities: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
}).passthrough();

export const appearanceSchema = z.object({
    colorScheme: z.enum([
        'light',
        'dark',
        'no-preference',
    ]).optional(),
}).strict();

export const deterministicPayloadSchema = z.object({
    mode: renderModeSchema.optional(),
    containerElement: z.string().min(1).optional(),
    areas: z.array(layoutAreaSchema).min(1),
    skeleton: z.boolean().optional(),
    appearance: appearanceSchema.optional(),
    context: z.unknown().optional(),
}).passthrough();

export const inferencePayloadSchema = z.object({
    mode: renderModeSchema.optional(),
    areaId: z.string().min(1),
    id: z.string().optional(),
    parentId: z.string().optional(),
    component: z.string().optional(),
    content: z.string().nullable().optional(),
    qualities: z.record(
        z.string(),
        z.unknown(),
    ).nullable().optional(),
    properties: z.record(z.string(), z.unknown()).optional(),
    events: z.array(
        z.string(),
    ).optional(),
    context: z.unknown().optional(),
}).passthrough();

export const renderPayloadSchema = z.object({
    mode: renderModeSchema.optional(),
    containerElement: z.string().min(1).optional(),
    areas: z.array(layoutAreaSchema).optional(),
    areaId: z.string().optional(),
    id: z.string().optional(),
    parentId: z.string().optional(),
    component: z.string().optional(),
    content: z.string().optional(),
    qualities: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
    properties: z.record(z.string(), z.unknown()).optional(),
    attributes: z.record(
        z.string(),
        z.string(),
    ).optional(),
    events: z.array(
        z.string(),
    ).optional(),
    skeleton: z.boolean().optional(),
    appearance: appearanceSchema.optional(),
    context: z.unknown().optional(),
}).passthrough();

export const skeletonPayloadSchema = z.object({
    areaId: z.string().min(1),
    kind: z.string().optional(),
    appearance: appearanceSchema.optional(),
    context: z.unknown().optional(),
}).strict();

export const clearPayloadSchema = z.object({
    areaId: z.string().min(1),
    context: z.unknown().optional(),
}).strict();

export const renderedResultSchema = z.object({
    mode: renderModeSchema,
    targetId: z.string().min(1),
    context: z.unknown().optional(),
}).passthrough();

export const errorSchema = z.object({
    areaId: z.string().nullable(),
    error: z.string(),
}).strict();

export const bodySchema = z.object({
    id: z.string().optional(),
    defaultContainer: z.string().optional(),
    confirmedMounts: z.array(z.string()).optional(),
    connectedElements: z.array(z.string()).optional(),
    pendingComponents: z.array(inferencePayloadSchema).optional(),
    appearance: appearanceSchema.optional(),
}).passthrough();

export type RenderModeType = z.infer<typeof renderModeSchema>;
export type LayoutArea = z.infer<typeof layoutAreaSchema>;
export type Appearance = z.infer<typeof appearanceSchema>;
export type DeterministicPayload = z.infer<typeof deterministicPayloadSchema>;
export type InferencePayload = z.infer<typeof inferencePayloadSchema>;
export type RenderPayload = z.infer<typeof renderPayloadSchema>;
export type SkeletonPayload = z.infer<typeof skeletonPayloadSchema>;
export type ClearPayload = z.infer<typeof clearPayloadSchema>;
export type RenderedResult = z.infer<typeof renderedResultSchema>;
export type ErrorResult = z.infer<typeof errorSchema>;
export type Body = z.infer<typeof bodySchema>;

import { z } from 'zod';

export const routeParameterSchema = z.object({
    name: z.string().min(1),
    value: z.unknown(),
}).strict();

export const navigationEntrySchema = z.object({
    url: z.string().min(1),
    timestamp: z.number().optional(),
}).strict();

export const navigateInitSchema = z.object({
    url: z.string().optional(),
    session: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
}).passthrough();

export const navigateRequestSchema = z.object({
    url: z.string().min(1),
    parameters: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
    replace: z.boolean().optional(),
}).strict();

export const navigateDestroySchema = z.object({}).strict();

export const navigationStateSchema = z.object({
    url: z.string().min(1),
    parameters: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
    timestamp: z.number().optional(),
    previousUrl: z.string().optional(),
}).strict();

export const bodySchema = z.object({
    id: z.string().optional(),
    url: z.string().optional(),
    currentPath: z.string().optional(),
    previousUrl: z.string().optional(),
    previousPath: z.string().optional(),
    records: z.array(navigationEntrySchema).optional(),
    parameters: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
}).strict();

export type RouteParameter = z.infer<typeof routeParameterSchema>;
export type NavigationEntry = z.infer<typeof navigationEntrySchema>;
export type NavigateInit = z.infer<typeof navigateInitSchema>;
export type NavigateRequest = z.infer<typeof navigateRequestSchema>;
export type NavigateDestroy = z.infer<typeof navigateDestroySchema>;
export type NavigationState = z.infer<typeof navigationStateSchema>;
export type Body = z.infer<typeof bodySchema>;

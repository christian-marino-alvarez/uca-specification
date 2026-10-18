import { z } from 'zod';

export const routeParameterSchema = z.object({
    name: z.string().min(1),
    value: z.unknown(),
}).strict();

export const navigateRequestSchema = z.object({
    path: z.string().min(1),
    parameters: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
    replace: z.boolean().optional(),
    correlationId: z.string().optional(),
}).strict();

export const navigationStateSchema = z.object({
    path: z.string().min(1),
    parameters: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
    url: z.string().optional(),
    timestamp: z.number().optional(),
    previousPath: z.string().optional(),
}).strict();

export const bodySchema = z.object({
    id: z.string().optional(),
    currentPath: z.string().optional(),
    previousPath: z.string().optional(),
    parameters: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
}).strict();

export type RouteParameter = z.infer<typeof routeParameterSchema>;
export type NavigateRequest = z.infer<typeof navigateRequestSchema>;
export type NavigationState = z.infer<typeof navigationStateSchema>;
export type Body = z.infer<typeof bodySchema>;

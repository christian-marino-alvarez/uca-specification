import { z } from 'zod';

export const routePayloadSchema = z.object({
    path: z.string().min(1),
    parameters: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
    replace: z.boolean().optional(),
}).strict();

export const routeStateSchema = z.object({
    path: z.string().min(1),
    parameters: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
    url: z.string().optional(),
    timestamp: z.number().optional(),
}).strict();

export const bodySchema = z.object({
    id: z.string().optional(),
    defaultPath: z.string().optional(),
}).strict();

export type RoutePayload = z.infer<typeof routePayloadSchema>;
export type RouteState = z.infer<typeof routeStateSchema>;
export type Body = z.infer<typeof bodySchema>;

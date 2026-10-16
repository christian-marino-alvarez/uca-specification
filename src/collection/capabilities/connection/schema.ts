import { z } from 'zod';

export const endpointSchema = z.object({
    id: z.string().min(1),
    signal: z.string().min(1),
}).strict();

export const routeSchema = z.object({
    source: endpointSchema,
    target: endpointSchema,
    value: z.record(z.string(), z.unknown()).optional(),
    forward: z.array(z.string().min(1)),
}).strict();

export const configurationSchema = z.object({
    routes: z.array(routeSchema),
}).strict();

export const bodySchema = z.object({
    id: z.string().min(1).optional(),
    routes: z.array(routeSchema).optional(),
}).strict();

export type Body = z.infer<typeof bodySchema>;
export type Configuration = z.infer<typeof configurationSchema>;
export type Route = z.infer<typeof routeSchema>;


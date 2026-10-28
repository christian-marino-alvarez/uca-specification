import { z } from 'zod';

export const httpMethodSchema = z.enum([
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'OPTIONS',
  'HEAD',
  'ALL',
]);

export const responsePayloadSchema = z.object({
  status: z.number().int().positive().optional(),
  headers: z.record(
    z.string(),
    z.string(),
  ).optional(),
  body: z.unknown().optional(),
}).strict();

export const requestContextSchema = z.object({
  requestId: z.string().min(1),
  method: z.string().min(1),
  path: z.string().min(1),
  query: z.record(
    z.string(),
    z.string(),
  ),
  headers: z.record(
    z.string(),
    z.string(),
  ),
  body: z.unknown().optional(),
}).strict();

export type HttpMethod = z.infer<typeof httpMethodSchema>;
export type ResponsePayload = z.infer<typeof responsePayloadSchema>;
export type RequestContext = z.infer<typeof requestContextSchema>;

export type RouteHandler = (
  context: RequestContext,
) => Response | ResponsePayload | Promise<Response | ResponsePayload>;

export const routeConfigSchema = z.object({
  method: httpMethodSchema,
  path: z.string().min(1),
  handler: z.custom<RouteHandler>().optional(),
  response: responsePayloadSchema.optional(),
}).strict();

export const listenConfigSchema = z.object({
  port: z.number().int().positive().optional(),
  hostname: z.string().min(1).optional(),
}).strict();

export const listeningStatusSchema = z.object({
  port: z.number().int().positive(),
  hostname: z.string().min(1),
  url: z.string().min(1),
}).strict();

export const respondConfigSchema = z.object({
  requestId: z.string().min(1),
  status: z.number().int().positive().optional(),
  headers: z.record(
    z.string(),
    z.string(),
  ).optional(),
  body: z.unknown().optional(),
}).strict();

export const bodySchema = z.object({
  id: z.string().optional(),
  context: z.string().optional(),
  port: z.number().int().positive().optional(),
  hostname: z.string().min(1).optional(),
  routes: z.array(routeConfigSchema).optional(),
  autoStart: z.boolean().optional(),
}).strict();

export type RouteConfig = z.infer<typeof routeConfigSchema>;
export type ListenConfig = z.infer<typeof listenConfigSchema>;
export type ListeningStatus = z.infer<typeof listeningStatusSchema>;
export type RespondConfig = z.infer<typeof respondConfigSchema>;
export type Body = z.infer<typeof bodySchema>;


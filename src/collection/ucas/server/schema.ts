import { z } from 'zod';
import {
  inferenceSchema,
  type InferPayload,
} from '@uca/llm/schema';
import type { RouteConfig } from '@uca/capability-http-server/types';

export const startConfigSchema = z.object({
  port: z.number().int().positive().optional(),
  hostname: z.string().min(1).optional(),
}).strict();

export const startedStatusSchema = z.object({
  port: z.number().int().positive(),
  hostname: z.string().min(1),
  url: z.string().min(1),
}).strict();

export const routeConfigSchema = z.custom<RouteConfig>();

export const respondConfigSchema = z.object({
  requestId: z.string().min(1),
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

export const pendingRequestSchema = z.object({
  requestId: z.string().min(1),
  stream: z.boolean().optional(),
  provider: z.string().optional(),
  payload: z.custom<InferPayload>(),
}).strict();

export const bodySchema = z.object({
  id: z.string().optional(),
  context: z.string().optional(),
  source: z.string().optional(),
  port: z.number().int().positive().optional(),
  hostname: z.string().min(1).optional(),
  routes: z.array(routeConfigSchema).optional(),
  autoStart: z.boolean().optional(),
  staticDir: z.string().optional(),
  webDir: z.string().optional(),
  pendingRequests: z.record(
    z.string(),
    pendingRequestSchema,
  ).optional(),
}).strict();

export {
  inferenceSchema,
};

export type StartConfig = z.infer<typeof startConfigSchema>;
export type StartedStatus = z.infer<typeof startedStatusSchema>;
export type PendingRequest = z.infer<typeof pendingRequestSchema>;
export type Body = z.infer<typeof bodySchema>;


import { z } from 'zod';

export const navigationParameterSchema = z.object({
    name: z.string().min(1),
    value: z.unknown(),
}).strict();

export const navigationSchema = z.object({
    navigateTo: z.string().min(1),
    parameters: z.array(
        navigationParameterSchema,
    ).optional(),
    correlationId: z.string().optional(),
    sessionId: z.string().optional(),
}).strict();

export const browserContextSchema = z.object({
    viewport: z.record(
        z.string(),
        z.unknown(),
    ),
    screen: z.record(
        z.string(),
        z.unknown(),
    ),
    browser: z.record(
        z.string(),
        z.unknown(),
    ),
}).strict();

export const decisionResultSchema = z.object({
    path: z.string().min(1),
    requiredUcas: z.array(
        z.string().min(1),
    ).optional(),
    context: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
    correlationId: z.string().optional(),
}).strict();

export const bodySchema = z.object({
    id: z.string().optional(),
    sessionId: z.string().optional(),
    activePage: z.string().optional(),
    parameters: z.array(
        navigationParameterSchema,
    ).optional(),
    browserContext: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
}).strict();

export type NavigationParameter = z.infer<typeof navigationParameterSchema>;
export type Navigation = z.infer<typeof navigationSchema>;
export type BrowserContext = z.infer<typeof browserContextSchema>;
export type DecisionResult = z.infer<typeof decisionResultSchema>;
export type Body = z.infer<typeof bodySchema>;

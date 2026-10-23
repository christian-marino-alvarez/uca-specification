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
    questionId: z.string().min(1),
    choice: z.string().min(1),
    confidence: z.number().min(0).max(1),
    probabilities: z.record(
        z.string(),
        z.number(),
    ).optional(),
    context: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
    correlationId: z.string().optional(),
}).passthrough();

export const sessionSchema = z.object({
    sessionId: z.string().min(1),
    lastRoute: z.string().min(1),
    timestamp: z.number(),
    parameters: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
}).strict();

export const bodySchema = z.object({
    id: z.string().optional(),
    sessionId: z.string().optional(),
    activePage: z.string().optional(),
    structural: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
    spatial: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
    design: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
    sessionState: z.enum([
        'PROMPT_RESUME',
        'FRESH',
        'ACTIVE',
    ]).optional(),
    previousSession: sessionSchema.optional(),
    parameters: z.array(
        navigationParameterSchema,
    ).optional(),
    browserContext: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
    specification: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
    limits: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
}).strict();

export type NavigationParameter = z.infer<typeof navigationParameterSchema>;
export type Navigation = z.infer<typeof navigationSchema>;
export type BrowserContext = z.infer<typeof browserContextSchema>;
export type DecisionResult = z.infer<typeof decisionResultSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type Body = z.infer<typeof bodySchema>;


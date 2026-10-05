import { z } from 'zod';

export const performanceMetricsSchema = z.object({
    t0: z.number(),
    ts: z.number().optional(),
    sc: z.number().optional(),
    tu: z.number().optional(),
    tr: z.number().optional(),
    th: z.number().optional(),
    tc: z.number().optional(),
    timeToScaffold: z.number().optional(),
    timeToFirstUca: z.number().optional(),
    timeToFirstRender: z.number().optional(),
    themeTime: z.number().optional(),
    initialCompositionTime: z.number().optional(),
});

export const bodySchema = z.object({
    title: z.string().optional(),
    question: z.string().optional(),
    buttonLabel: z.string().optional(),
    documentation: z.string().optional(),
    model: z.string().optional(),
    endpoint: z.string().optional(),
    sseEndpoint: z.string().optional(),
    factory: z.unknown().optional(),
    composedResult: z.unknown().optional(),
    metrics: performanceMetricsSchema.optional(),
});

export type PerformanceMetrics = z.infer<typeof performanceMetricsSchema>;
export type Body = z.infer<typeof bodySchema>;

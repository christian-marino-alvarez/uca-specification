import { z } from 'zod';

export const complianceReportSchema = z.object({
    compliant: z.boolean(),
    warnings: z.array(z.string()),
}).strict();

export const telemetryEventSchema = z.object({
    type: z.enum([
        'inference_request',
        'inference_response',
        'render_request',
        'render_completed',
        'compliance_anomaly',
        'lifecycle',
    ]),
    timestamp: z.number(),
    source: z.string().optional(),
    property: z.string().optional(),
    correlationId: z.string().optional(),
    areaId: z.string().optional(),
    elementId: z.string().optional(),
    component: z.string().optional(),
    uca: z.string().optional(),
    durationMs: z.number().optional(),
    signalBody: z.unknown().optional(),
    compliance: complianceReportSchema.optional(),
}).strict();

export const bodySchema = z.object({
    id: z.string().min(1).optional(),
    enabled: z.boolean().optional().default(true),
    logToConsole: z.boolean().optional().default(true),
    detectAnomalies: z.boolean().optional().default(true),
}).strict();

export type Body = z.infer<typeof bodySchema>;
export type TelemetryEvent = z.infer<typeof telemetryEventSchema>;
export type ComplianceReport = z.infer<typeof complianceReportSchema>;

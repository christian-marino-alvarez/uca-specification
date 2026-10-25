import { z } from 'zod';

export const complianceReportSchema = z.object({
    compliant: z.boolean(),
    warnings: z.array(z.string()),
}).strict();

export const signalSchema = z.object({
    source: z.string().optional().describe('Identificador de la entidad emisora'),
    sourceKind: z.enum(['UCA', 'CAPABILITY', 'EXTERNAL']).optional().describe('Naturaleza ontológica de la entidad emisora'),
    targetId: z.string().optional().describe('Identificador opcional de la entidad destino'),
    property: z.string().optional().describe('Propiedad, evento o estímulo nervioso transmitido'),
    payload: z.unknown().optional().describe('Cuerpo o payload transportado dentro de la señal (Body)'),
    timestamp: z.number().describe('Marca temporal de emisión en milisegundos'),
    sessionId: z.string().optional().describe('Identificador único de sesión y trazabilidad nerviosa de la señal a nivel de transporte'),
}).describe('Esquema formal del sobre de transporte Signal para la comunicación nerviosa');

export const telemetryEventSchema = signalSchema.extend({
    type: z.enum([
        'inference_request',
        'inference_response',
        'render_request',
        'render_completed',
        'compliance_anomaly',
        'lifecycle',
    ]),
    areaId: z.string().optional(),
    elementId: z.string().optional(),
    component: z.string().optional(),
    uca: z.string().optional(),
    durationMs: z.number().optional(),
    compliance: complianceReportSchema.optional(),
}).strict();

export const bodySchema = z.object({
    id: z.string().min(1).optional(),
    enabled: z.boolean().optional().default(true),
    logToConsole: z.boolean().optional().default(true),
    detectAnomalies: z.boolean().optional(),
    filter: z.array(z.string()).optional(),
}).strict();

export type Body = z.infer<typeof bodySchema>;
export type SignalPayload = z.infer<typeof signalSchema>;
export type TelemetryEvent = z.infer<typeof telemetryEventSchema>;
export type ComplianceReport = z.infer<typeof complianceReportSchema>;

import { z } from 'zod';

export const thinkingLevelSchema = z.enum(['minimal', 'low', 'medium', 'high'])
    .describe('Nivel de razonamiento o profundidad cognitiva del modelo');

export type ThinkingLevel = z.infer<typeof thinkingLevelSchema>;

export const providerSchema = z.enum(['openai', 'gemini', 'jev'])
    .describe('Proveedor de inferencia de backend');

export type ProviderType = z.infer<typeof providerSchema>;

export const jsonSchema = z.record(z.string(), z.unknown())
    .describe('Especificacion estandar de JSON Schema');

export const contractSchema = z.object({
    id: z.string().optional().describe('Identificador de la UCA emisora'),
    purpose: z.string().min(1).describe('Proposito ontologico fundamental de la UCA'),
    intention: z.string().optional().describe('Intencion operativa que guia la inferencia'),
    goal: z.string().optional().describe('Objetivo operativo auxiliar o derivado de la intencion'),
    outputSchema: z.union([
        z.instanceof(z.ZodType),
        jsonSchema,
    ]).optional().describe('Esquema formal esperado de respuesta (ZodType o JSON Schema)'),
    context: z.record(z.string(), z.unknown()).optional().describe('Contexto de hechos, propiedades y limites de la disposicion'),
    contextSchema: jsonSchema.optional().describe('Especificacion JSON Schema con definiciones pedagogicas de las claves del contexto'),
});

export const configurationSchema = z.object({
    provider: providerSchema.optional(),
    model: z.string().optional().describe('Modelo concreto de lenguaje o razonamiento'),
    imagination: z.number().optional().describe('Temperatura o grado de libertad estocastica'),
    limit: z.number().optional().describe('Limite maximo de tokens de salida'),
    thinkingBudget: z.number().optional().describe('Presupuesto de tokens de razonamiento'),
    thinkingLevel: thinkingLevelSchema.optional(),
});

export const inferenceSchema = contractSchema.extend({
    ...configurationSchema.shape,
    correlationId: z.string().optional(),
    streamId: z.string().optional(),
});

export type Contract = z.infer<typeof contractSchema>;
export type InferPayload = z.infer<typeof inferenceSchema>;

export const bodySchema = z.object({
    id: z.string().optional(),
    endpoint: z.string().optional(),
    streamEndpoint: z.string().optional(),
    ...configurationSchema.shape,
});

export type Body = z.infer<typeof bodySchema>;

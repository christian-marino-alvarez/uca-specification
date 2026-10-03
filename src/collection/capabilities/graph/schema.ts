import { z } from 'zod';

export const signalDeclarationSchema = z.object({
    signal: z.string(),
    type: z.string().default('unknown'),
    description: z.string().optional(),
});

export const aimSchema = z.object({
    description: z.string(),
    body: z.record(z.string(), z.unknown()).optional(),
});

export const reactToSignalSchema = z.string().regex(
    /^[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+\.[a-zA-Z0-9_.-]+$/,
    'reactTo must follow format <prefix>:<id>.<outcome> (e.g. "action:simulate-pulse.triggered")'
);

export const dispositionSchema = z.object({
    aim: aimSchema,
    reactTo: z.array(reactToSignalSchema).optional().default([]),
    inputs: z.array(signalDeclarationSchema).optional(),
    outputs: z.array(signalDeclarationSchema).optional(),
});

export const ucaItemSchema = z.object({
    id: z.string(),
    disposition: dispositionSchema,
});

export const responseDataSchema = z.object({
    ucas: z.array(ucaItemSchema),
    answer: z.string().optional(),
});

export const responseSchema = z.object({
    data: responseDataSchema,
    error: z.unknown().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
});

export type ResponseSchema = z.infer<typeof responseSchema>;
export type ResponseData = z.infer<typeof responseDataSchema>;
export type UcaItem = z.infer<typeof ucaItemSchema>;

export function getResponseJsonSchema(): Record<string, unknown> {
    const rawSchema = z.toJSONSchema(responseSchema) as Record<string, unknown>;
    const { $schema, ...cleanSchema } = rawSchema;
    return cleanSchema;
}

export function getUcaItemJsonSchema(): Record<string, unknown> {
    const rawSchema = z.toJSONSchema(ucaItemSchema) as Record<string, unknown>;
    const { $schema, ...cleanSchema } = rawSchema;
    return cleanSchema;
}

export function getDispositionJsonSchema(): Record<string, unknown> {
    const rawSchema = z.toJSONSchema(dispositionSchema) as Record<string, unknown>;
    const { $schema, ...cleanSchema } = rawSchema;
    return cleanSchema;
}

export function getCommunicationJsonSchema(): Record<string, unknown> {
    return getResponseJsonSchema();
}

import { z } from 'zod';

export const signalDeclarationSchema = z.object({
    signal: z.string().describe('Signal identifier name (e.g. "create", "action.triggered")'),
    type: z.string().default('unknown').describe('Data type descriptor of payload'),
    description: z.string().optional().describe('Signal purpose and semantics'),
});

export const aimSchema = z.object({
    description: z.string().describe('Teleological description of UCA purpose'),
    body: z.record(z.string(), z.unknown()).optional().describe('Key-value domain properties configuring the UCA'),
});

export const reactToSignalSchema = z.string().regex(
    /^(?:[a-zA-Z0-9_-]+:)?[a-zA-Z0-9_-]+\.[a-zA-Z0-9_.-]+$/,
    'reactTo must follow format [prefix:]<id>.<outcome> (e.g. "action:simulate-pulse.triggered")'
).describe('External signal from another UCA to subscribe and react to');

export const parentToSchema = z.object({
    uca: z.string().describe('Parent container UCA identifier (e.g. "box:root", "box:card", "collector:form")'),
    relation: z.string().describe('Structural role inside parent container (e.g. "child", "header", "content", "action")'),
}).describe('Structural hierarchical placement inside parent container (omit on root containers)');

export const dispositionSchema = z.object({
    aim: aimSchema,
    reactTo: z.array(reactToSignalSchema).optional().default([]).describe('Reactive subscriptions to external outcomes emitted by other UCAs'),
    parentTo: parentToSchema.optional(),
    inputs: z.array(signalDeclarationSchema).optional().describe('List of accepted input signals'),
    outputs: z.array(signalDeclarationSchema).optional().describe('List of emitted output signals'),
});

export const ucaItemSchema = z.object({
    id: z.string().describe('Unique UCA identifier with prefix (e.g. "box:hero", "action:submit", "picture:logo")'),
    disposition: dispositionSchema,
});

export const responseDataSchema = z.object({
    ucas: z.array(ucaItemSchema).describe('Composed list of UCAs forming the reactive view hierarchy'),
    answer: z.string().optional().describe('Concise description of the designed layout, structure, and reactive wiring'),
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

export function getOutputJsonSchema(): string {
    const schema = getResponseJsonSchema();
    return JSON.stringify(schema, null, 2);
}

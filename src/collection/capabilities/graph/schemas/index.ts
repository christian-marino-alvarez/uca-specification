import { z } from 'zod';
import { responseSchema } from './response.js';
import { ucaItemSchema } from './uca-item.js';
import { dispositionSchema } from './disposition.js';

export * from './signal.js';
export * from './aim.js';
export * from './react-to.js';
export * from './parent-to.js';
export * from './disposition.js';
export * from './uca-item.js';
export * from './response.js';

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

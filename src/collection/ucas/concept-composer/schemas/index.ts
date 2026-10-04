import { z } from 'zod';
import { conceptMapSchema } from './concept-map.js';

export * from './theme.js';
export * from './capability.js';
export * from './zone.js';
export * from './concept-map.js';

export function getConceptMapJsonSchema(): Record<string, unknown> {
    const rawSchema = z.toJSONSchema(conceptMapSchema) as Record<string, unknown>;
    const { $schema, ...cleanSchema } = rawSchema;
    return cleanSchema;
}

export function getConceptMapOutputSchema(): string {
    const schema = getConceptMapJsonSchema();
    return JSON.stringify(schema, null, 2);
}

export const CONCEPT_MAP_SCHEMA = getConceptMapJsonSchema();

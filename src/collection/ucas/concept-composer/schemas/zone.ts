import { z } from 'zod';

export const zoneConceptSchema = z.object({
    name: z.string().describe('Zone name (e.g. Header, MainContent, Footer)'),
    capabilities: z.array(z.string()).describe('Names of capabilities residing in this zone'),
    purpose: z.string().optional().describe('Brief narrative purpose'),
});

export type ZoneConcept = z.infer<typeof zoneConceptSchema>;

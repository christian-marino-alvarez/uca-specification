import { z } from 'zod';

export const zoneConceptSchema = z.object({
    name: z.string().describe('Narrative zone or experiential chapter name (e.g. WelcomeHorizon, DiscoveryBay)'),
    purpose: z.string().describe('Narrative purpose in the user experience flow'),
    capabilities: z.array(z.string()).describe('Names of the conceptual capabilities residing in this zone'),
});

export type ZoneConcept = z.infer<typeof zoneConceptSchema>;

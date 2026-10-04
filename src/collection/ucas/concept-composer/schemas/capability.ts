import { z } from 'zod';

export const capabilityConceptSchema = z.object({
    name: z.string().describe('Capability name (e.g. HeroNarrative, FeatureGrid)'),
    purpose: z.string().describe('Concise 1-sentence purpose'),
    interaction: z.string().optional().describe('Interaction dynamic'),
});

export type CapabilityConcept = z.infer<typeof capabilityConceptSchema>;

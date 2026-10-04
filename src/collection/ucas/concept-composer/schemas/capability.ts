import { z } from 'zod';

export const capabilityConceptSchema = z.object({
    name: z.string().describe('Conceptual capability name (e.g. HeroNarrative, CuratedCatalog, InteractiveFilter)'),
    purpose: z.string().describe('User need, cognitive value, or goal this capability fulfills'),
    interaction: z.string().describe('Abstract interaction dynamic (e.g. immersive visual exploration, rapid intent resolution)'),
});

export type CapabilityConcept = z.infer<typeof capabilityConceptSchema>;

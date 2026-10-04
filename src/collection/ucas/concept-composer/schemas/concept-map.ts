import { z } from 'zod';
import { themeConceptSchema } from './theme.js';
import { capabilityConceptSchema } from './capability.js';
import { zoneConceptSchema } from './zone.js';

export const conceptMapSchema = z.object({
    theme: themeConceptSchema.describe('Thematic identity and visual aesthetic principles'),
    capabilities: z.array(capabilityConceptSchema).min(2).describe('List of conceptual capabilities needed for this web application'),
    zones: z.array(zoneConceptSchema).min(1).describe('Ordered narrative zones structuring the user journey'),
});

export type ConceptMap = z.infer<typeof conceptMapSchema>;

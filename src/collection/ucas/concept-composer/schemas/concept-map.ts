import { z } from 'zod';
import { themeConceptSchema } from './theme.js';
import { capabilityConceptSchema } from './capability.js';
import { zoneConceptSchema } from './zone.js';

export const conceptMapSchema = z.object({
    theme: themeConceptSchema.describe('Thematic identity and visual aesthetic principles'),
    capabilities: z.array(capabilityConceptSchema).min(1).max(3).describe('Core conceptual capabilities (max 3)'),
    zones: z.array(zoneConceptSchema).min(1).max(3).describe('Core narrative zones (max 3)'),
});

export type ConceptMap = z.infer<typeof conceptMapSchema>;

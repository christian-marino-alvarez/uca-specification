import { z } from 'zod';

export const themeConceptSchema = z.object({
    name: z.string().describe('Brand or concept title (max 4 words)'),
    mood: z.string().describe('Visual tone and atmosphere (max 6 words)'),
    essence: z.string().optional().describe('Narrative essence'),
    aesthetic: z.string().optional().describe('Visual aesthetic personality'),
});

export type ThemeConcept = z.infer<typeof themeConceptSchema>;

import { z } from 'zod';

export const themeConceptSchema = z.object({
    name: z.string().describe('Brand or aesthetic title of the digital experience'),
    essence: z.string().describe('Inspiring visionary essence and narrative value proposition'),
    mood: z.string().describe('Emotional mood, atmosphere, and communicative tone'),
    aesthetic: z.string().describe('Abstract visual personality, contrast, whitespace, and visual rhythm'),
});

export type ThemeConcept = z.infer<typeof themeConceptSchema>;

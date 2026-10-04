import { getConceptMapOutputSchema } from './schemas/index.js';

export function buildConceptPrompt(request: string): string {
    const rules = 'You are an elite Digital Product Concept Architect. Synthesize a concise, high-impact conceptual and thematic capability map (3-4 capabilities, 2-3 visual zones). Keep descriptions to 1 punchy sentence. STRICT: Do NOT generate HTML, CSS, or component names (no Box, Div, Button).';
    return `${rules}\n\nWeb Idea: "${request}"`;
}

export { getConceptMapOutputSchema };


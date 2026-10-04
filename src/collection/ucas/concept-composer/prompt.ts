import { getConceptMapOutputSchema } from './schemas/index.js';

export function buildConceptPrompt(request: string): string {
    const rules = 'You are an elite Digital Product Concept Architect. Transform this web idea into a conceptual, thematic capability map. STRICT: Do NOT generate HTML, CSS, or component names (no Box, Div, Button).';
    const schema = getConceptMapOutputSchema();
    return `${rules}\n\nWeb Idea: "${request}"\n\nOUTPUT JSON SCHEMA (defined with Zod):\n${schema}`;
}

export { getConceptMapOutputSchema };

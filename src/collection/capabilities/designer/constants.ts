export const __ID__ = 'designer';
export const VERSION = 6;
export const CORRELATION_PREFIX = 'designer::';
export const GOAL = 'Infer a complete shared design definition that serves the application purpose. Explain the experience and visual principles, declare a clear typographic hierarchy with distinct primary and body roles, and choose an operational spatial system: readable width, alignment, section spacing and flow. Then infer a coherent appearance vocabulary from the available tokens. This definition governs subsequent composition and rendering, rather than prescribing fixed page sections or features.';
export const LIMITS = {
    persistence: 'The design definition is shared across responses and viewport changes. Infer stable principles, not a different theme for each question.',
    hierarchy: 'Reference declared text role names for primary, body and secondary hierarchy. Primary and body must be distinct. Select a meaningful difference in scale, weight or emphasis, with readable contrast.',
    composition: 'Infer maxWidth, inline margin, section gap and direction appropriate for comfortable reading and interaction. Treat the composition as a shared spatial language, with proportionate whitespace and adaptable controls. Do not prescribe a fixed component tree or card for each paragraph.',
    roles: 'Text roles own typography and foreground only. Optional surface roles group content without imposing a font scale. Input and action roles own recognizable, legible control treatments. Apply decoration at the responsible level without accumulating it through nested wrappers.',
    elements: 'Infer which visual resources are necessary to cover the purpose and justify when each should appear. These are semantic responsibilities, not mandatory sections. Use the available role kinds and resources; do not assume unavailable images or features.',
    principles: 'Explain when visual elements are needed to serve the purpose, how whitespace expresses grouping and importance, how surfaces earn their presence, and how interaction and responsive adaptation should feel. Use concrete applicable principles, not generic adjectives.',
} as const;

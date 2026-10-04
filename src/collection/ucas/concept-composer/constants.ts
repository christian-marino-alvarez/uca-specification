import { type ConceptMap, SignalType } from './types.js';

export const __ID__ = 'concept-composer';

export const PURPOSE = 'Transform application intent into a conceptual and thematic capability map for parallel composition';

export const DEFAULT_MODEL = 'gemini-2.5-flash';

export const DEFAULT_PROVIDER = 'gemini';

export const DEFAULT_THINKING_BUDGET = 0;

export const DEFAULT_MAX_OUTPUT_TOKENS = 350;

export const DEFAULT_TEMPERATURE = 0.1;

export const DEFAULT_SIGNALS: readonly string[] = [
    SignalType.CREATE,
    SignalType.UPDATE,
    SignalType.REMOVE,
];

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

export const DEFAULT_CONCEPT_MAP: ConceptMap = {
    theme: {
        name: 'Digital Experience',
        essence: 'Modern, engaging and intuitive digital application interface',
        mood: 'Sophisticated, fluid and inspiring',
        aesthetic: 'Clean contrast, purposeful whitespace and harmonious visual rhythm',
    },
    capabilities: [
        {
            name: 'HeroNarrative',
            purpose: 'Capture attention and communicate primary value proposition',
            interaction: 'Visual immersion with direct exploration prompt',
        },
        {
            name: 'DiscoveryDeck',
            purpose: 'Facilitate organic exploration of core offerings and capabilities',
            interaction: 'Interactive browsing and contextual reveal',
        },
        {
            name: 'ActionGateway',
            purpose: 'Empower immediate user intent resolution and engagement',
            interaction: 'Focused call to action and fluid feedback',
        },
    ],
    zones: [
        {
            name: 'WelcomeHorizon',
            purpose: 'Orient and inspire first impressions',
            capabilities: ['HeroNarrative'],
        },
        {
            name: 'MainCanvas',
            purpose: 'Deliver primary functional and informational value',
            capabilities: ['DiscoveryDeck', 'ActionGateway'],
        },
    ],
};

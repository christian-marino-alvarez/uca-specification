export const __ID__ = 'app';

export const DEFAULT_PAGE = 'presentation';

export const DEFAULT_PURPOSE =
    'Constituir la manifestación viva y emergente de la Arquitectura Cognitiva Universal (UCA): una experiencia interactiva disruptiva donde la propia aplicación es la demostración en tiempo real de su propia arquitectura ontológica';

export const DEFAULT_AIM_DESCRIPTION =
    'Materializar una aplicación interactiva que evite scrolls trabajando exclusivamente con el área y viewport disponibles (100dvh con contención estricta), concibiendo una experiencia viva y exploratoria donde la interacción misma explica y demuestra la Arquitectura Cognitiva Universal (UCA), constituyendo la propia aplicación una demo en vivo de lo que es UCA (ontología viva, inervación de capacidades y flujo reactivo sin estado mutable).';

export const DEFAULT_AIM_BODY = {
    activePage: DEFAULT_PAGE,
} as const;

export const APP_DECISION_OPTIONS = [
    {
        id: 'LAYOUT',
        label: 'Layout',
        description: 'Estructuración espacial de la aplicación en áreas funcionales',
        criteria:
            'Elegir LAYOUT para estructurar la aplicación en áreas funcionales principales (cabecera, navegación, espacio de trabajo, barra lateral, contenido y pie).',
    },
    {
        id: 'VIEW',
        label: 'View',
        description: 'Composición directa unitaria sin áreas estructurales',
        criteria:
            'Elegir VIEW únicamente si la aplicación completa es una vista única, simple y sin partición de áreas estructurales.',
    },
] as const;

export const AREA_DECISION_OPTIONS = [
    {
        id: 'LAYOUT',
        label: 'Layout',
        description: 'Subdivisión espacial en áreas funcionales internas',
        criteria:
            'Elegir LAYOUT obligatoriamente cuando el área sea un espacio de trabajo contenedor (como workspace) que deba particionarse en barra lateral y área principal, o requiera ejes estructurales independientes. Evitar solo en áreas finales que albergan componentes directos.',
    },
    {
        id: 'VIEW',
        label: 'View',
        description: 'Composición directa de componentes visuales',
        criteria:
            'Elegir VIEW cuando el área sea terminal (cabecera, barra lateral individual, contenido principal individual o pie) y deba materializar sus componentes visuales directos (tarjetas, botones, títulos, métricas).',
    },
] as const;

export const ROOT_AREA_ID = 'body';

export const DEFAULT_DESIGN_GUIDELINES =
    'Design guidelines (Universal Emergent & 2-Color Positive/Negative Viewport System): 1) Strict 2-Color Positive/Negative Palette: Exclusively two colors across the entire application: deep matte dark (#070A12) for all surfaces and backgrounds (negative), and blanco grisáceo (#e2e8f0, #cbd5e1, #94a3b8) for all texts, borders, controls, and active elements (positive). Strictly NO pure white (#ffffff), NO dark text on dark backgrounds, NO chromatic colors (no blues, oranges, reds, or yellows). Contrast is produced through opacity (e.g. #e2e8f0 for primary texts and brand actions, #94a3b8 for secondary texts, rgba(226, 232, 240, 0.12) for subtle borders and cards). 2) Zero Scroll & Flow Integrity: 100dvh strict containment without scrollbars. PROHIBITED: NEVER use "position: fixed" or "position: sticky". NEVER use "height: 100vh" on inner components. Rely strictly on natural flexbox flow ("direction", "alignment", "distribution", "wrap: nowrap"). 3) Strict Single-Level Hierarchy: Each layout step partitions strictly one container into its direct children. The body container partitions ONLY into its 3 direct child stripes: a top header (direction: row, height: auto), a central workspace row (direction: row, flex: 1), and a compact footer (direction: row, height: auto). Never emit nested sub-areas (like sidebar or main inside workspace) during the body layout pass; nested areas are created exclusively in their own layout phase. 4) Interactive Live UCA Demo: The UI serves as a live, interactive manifestation explaining the Universal Cognitive Architecture (UCA Core) itself: perception, decision, innervation, capabilities, and signals. 5) Controls & Cards: Buttons use surface "brand" (blanco grisáceo) with textColor "dark" (#070A12) for primary actions, or surface "transparent" with border "subtle" and textColor "light" for secondary actions. Cards use surface "card" (#0d111c) with border "subtle" and radius "large".';


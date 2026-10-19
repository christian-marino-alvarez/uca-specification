export const __ID__ = 'app';

export const DEFAULT_PAGE = 'presentation';

export const DEFAULT_PURPOSE =
    'Demostrar la Arquitectura Cognitiva Universal (UCA) mediante una experiencia web interactiva donde la interfaz emerge de forma armónica a través de percepción, decisión y acción reactiva';

export const DEFAULT_AIM_DESCRIPTION =
    'Construir una página de presentación coherente y profesional estructurada en 4 secciones canónicas directas: 1) header (barra de navegación con el logo exclusivo de marca assets/uca-logo.svg, enlaces Arquitectura y Principios, y botón Explorar); 2) hero (sección principal con título "La interfaz emerge en conjunto", texto lead explicativo y botones de acción); 3) principles (sección del modelo con 3 tarjetas: Percibir, Decidir y Actuar); 4) footer (pie de página con metadatos y enlaces del sistema)';

export const DEFAULT_AIM_BODY = {
    activePage: DEFAULT_PAGE,
} as const;

export const AREA_DECISION_OPTIONS = [
    {
        id: 'VIEW',
        label: 'View',
        description: 'Representación directa y autocontenida mediante componentes UCA',
        criteria:
            'Elegir VIEW para todas las secciones funcionales de la página (header, hero, principles, footer, etc.) donde los elementos visuales se componen directamente. Es la opción obligatoria para cualquier sección hija de app.',
    },
    {
        id: 'LAYOUT',
        label: 'Layout',
        description: 'Partición estructural en áreas específicas',
        criteria:
            'Elegir LAYOUT únicamente para el contenedor raíz (#app) para estructurarlo en sus 4 secciones canónicas (header, hero, principles, footer).',
    },
] as const;

export const ROOT_AREA_ID = 'app';

export const DEFAULT_DESIGN_GUIDELINES =
    'Design guidelines: Minimalist, modern pro UI. Brand Logo: use picture with src "assets/uca-logo.svg" and alt "UCA" ONLY in the navigation header, NEVER duplicate in other sections or cards. Containers: use box with direction (column/row), spacing (medium/large), gap (medium/large), surface (card/muted/dark/transparent), border (subtle), radius (large), elevation (card). Navigation: use action with surface (transparent/muted) or access with destination and label. Buttons: use action with surface (brand/muted), textColor (light), radius (medium), label or content. Headings: use heading with textSize (display/title/large), fontWeight (bold/semibold). Paragraphs: use paragraph with textColor (muted/light), textSize (medium). Always declare visual qualities.';


export const __ID__ = 'layout';

export const DEFAULT_LIMIT = 4096;

export const DEFAULT_IMAGINATION = 0.2;

export const LAYOUT_GOAL =
    'Partition the current container Box strictly into its immediate direct child Box areas only (single-level partition). All child areas must have parentId pointing to the current container. Infer purpose, intention, dimensions (width, height, flex) and the visual object ({ intention, disposicion }) from the supplied visual context and guidelines. Every area is a structural Box and must declare its spatial delimitation within visual.disposicion: 1) direction or division for child composition; 2) perimeter padding (spacing: "none"|"small"|"medium"|"large"|"xlarge"); 3) physical delimiting boundary (outline: "subtle"|"strong"|"dashed"|"none"); 4) perimeter vertical margin (marginBlock: "none"|"small"|"medium"|"large"); 5) distinct surface (default, muted, card); and 6) gap between multiple sibling areas. Flex only sizes that area within its parent, never to select its child layout. Keep purpose, intention and visual.intention strictly concise (maximum 6-8 words each) to optimize streaming latency.';

export const LAYOUT_PURPOSE =
    'Construct autonomous spatial layout area partition structures and hierarchies';

export const LAYOUT_INTENTION =
    'Estructurar exclusivamente las áreas hijas directas del contenedor Box actual mediante una partición estricta de un solo nivel. Cada área se materializa mediante UCA Box y sus cualidades se infieren dentro del contrato visual declarado, sin asumir plantillas prefabricadas.';


export const ROOT_AREA_ID = 'body';

export const ROOT_AREA = {
    id: ROOT_AREA_ID,
    purpose: 'Contenedor raíz y lienzo global de la aplicación',
    intention: 'Albergar y estructurar las áreas directas del sistema',
    dimensions: {
        width: 'full',
        height: 'full',
        flex: 'fill',
    },
    visual: {
        intention: 'Contenedor vertical a pantalla completa con ordenación flexible',
        disposicion: {
            direction: 'column',
            spacing: 'none',
            outline: 'none',
            marginBlock: 'none',
        },
    },
    qualities: {
        direction: 'column',
    },
    container: {
        id: 'viewport',
        qualities: {
            direction: 'column',
        },
    },
} as const;

export const LAYOUT_VISUAL_DISPOSITION = {
    role: 'layout-engine',
    spatialProperties: {
        flow: {
            direction: [
                'row',
                'column',
            ],
            wrap: [
                'nowrap',
                'wrap',
            ],
        },
        alignment: {
            distribution: [
                'start',
                'center',
                'end',
                'between',
                'around',
                'evenly',
            ],
            alignment: [
                'start',
                'center',
                'end',
                'stretch',
                'baseline',
            ],
        },
        spacing: {
            gap: [
                'none',
                'small',
                'medium',
                'large',
                'xlarge',
            ],
            spacing: [
                'none',
                'small',
                'medium',
                'large',
                'xlarge',
            ],
            spacingInline: [
                'none',
                'small',
                'medium',
                'large',
                'xlarge',
            ],
            spacingBlock: [
                'none',
                'small',
                'medium',
                'large',
                'xlarge',
            ],
            marginBlock: [
                'none',
                'small',
                'medium',
                'large',
                'xlarge',
            ],
            marginInline: [
                'none',
                'small',
                'medium',
                'large',
                'xlarge',
                'auto',
            ],
        },
        dimensions: {
            width: [
                'full',
                'compact',
                'regular',
                'sidebar',
                'wide',
                'auto',
            ],
            height: [
                'full',
                'header',
                'footer',
                'screen',
                'auto',
            ],
            flex: [
                'none',
                'initial',
                'auto',
                'fill',
                'grow',
                'shrink',
            ],
            minHeight: [
                'small',
                'medium',
                'large',
            ],
        },
        containment: {
            overflow: [
                'hidden',
                'auto',
                'visible',
                'scroll',
            ],
        },
        surface: {
            surface: [
                'default',
                'card',
                'muted',
                'dark',
                'transparent',
            ],
        },
        outlines: {
            outline: [
                'none',
                'subtle',
                'strong',
            ],
            outlineBottom: [
                'none',
                'subtle',
                'strong',
            ],
            outlineTop: [
                'none',
                'subtle',
                'strong',
            ],
            outlineRight: [
                'none',
                'subtle',
                'strong',
            ],
            outlineLeft: [
                'none',
                'subtle',
                'strong',
            ],
        },
    },
    description: 'Estructuración espacial de áreas y contenedores mediante propiedades CSS declarativas de flexbox, espaciado, dimensiones, contención y apariencia',
} as const;

export const SPATIAL_PIECES = [
    {
        name: 'Box',
        category: 'container',
        description: 'Bloque estructural atómico para crear e instanciar áreas en DOM',
    },
    {
        name: 'Direction',
        category: 'flow',
        description: 'Eje principal: column para franjas verticales, row para horizontales',
    },
    {
        name: 'Division',
        category: 'flow',
        description: 'Partición en cuadrícula: single, halves, thirds, quarters, sidebar-main, auto',
    },
    {
        name: 'Span',
        category: 'sizing',
        description: 'Cobertura de celdas en la cuadrícula: single, double, triple, full',
    },
    {
        name: 'Distribution',
        category: 'alignment',
        description: 'Distribución espacial a lo largo del eje principal (start, center, end, between, around, evenly)',
    },
    {
        name: 'Alignment',
        category: 'alignment',
        description: 'Alineación transversal en eje secundario (start, center, end, stretch, baseline)',
    },
    {
        name: 'Spacing',
        category: 'spacing',
        description: 'Padding perimetral del área (none, small, medium, large, xlarge)',
    },
    {
        name: 'Gap',
        category: 'spacing',
        description: 'Espacio de separación entre áreas hijas (none, small, medium, large)',
    },
    {
        name: 'Dimensions',
        category: 'sizing',
        description: 'Dimensiones dimensionales explícitas (width, height, flex)',
    },
    {
        name: 'Surface',
        category: 'appearance',
        description: 'Fondo del área (default, muted, card, transparent)',
    },
    {
        name: 'Borders',
        category: 'boundaries',
        description: 'Delimitación perimetral (outline o borderBottom, borderRight, borderTop)',
    },
    {
        name: 'Overflow',
        category: 'containment',
        description: 'Aislamiento de scroll para áreas de trabajo (auto, hidden, visible, scroll)',
    },
] as const;

export const LAYOUT_BOX_ROLE_PROPERTIES = {
    parentContainer: {
        description: 'Propiedades de UCA Box que el contenedor padre debe definir para organizar y contener a sus hijos',
        properties: [
            'direction',
            'division',
            'distribution',
            'alignment',
            'wrap',
            'gap',
            'spacing',
            'spacingInline',
            'spacingBlock',
            'marginBlock',
            'overflow',
        ],
    },
    childArea: {
        description: 'Propiedades de UCA Box que cada área hija directa debe definir para determinar su participación dimensional y delimitación',
        properties: [
            'width',
            'height',
            'minWidth',
            'minHeight',
            'flex',
            'span',
            'borderBottom',
            'borderRight',
            'borderTop',
            'borderLeft',
            'surface',
            'spacing',
            'marginBlock',
            'order',
            'overflow',
        ],
    },
} as const;

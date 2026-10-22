export const __ID__ = 'layout';

export const DEFAULT_LIMIT = 4096;

export const DEFAULT_IMAGINATION = 0.2;

export const LAYOUT_GOAL =
    'Partition the current container Box strictly into its immediate direct child Box areas only (single-level partition). All child areas must have parentId pointing to the current container. Infer the functional purpose, intention, and supported Box qualities for each area from the supplied visual language and context. Every area is a structural Box and must declare its spatial delimitation: 1) direction or division for child composition; 2) perimeter padding (spacing: "none"|"small"|"medium"|"large"|"xlarge"); 3) physical delimiting boundary (border: "subtle"|"strong"|"outline"|"none"); 4) perimeter vertical margin (marginBlock: "none"|"small"|"medium"|"large"); 5) distinct surface (default, muted, card); and 6) gap between multiple sibling areas. Flex only sizes that area within its parent, never to select its child layout.';

export const LAYOUT_PURPOSE =
    'Construct autonomous spatial layout area partition structures and hierarchies';

export const LAYOUT_INTENTION =
    'Estructurar exclusivamente las áreas hijas directas del contenedor Box actual mediante una partición estricta de un solo nivel. Cada área se materializa mediante UCA Box y sus cualidades se infieren dentro del contrato visual declarado, sin asumir plantillas prefabricadas.';


export const ROOT_AREA_ID = 'body';

export const ROOT_AREA = {
    id: ROOT_AREA_ID,
    purpose: 'Contenedor raíz y lienzo global de la aplicación',
    intention: 'Albergar y estructurar las áreas directas del sistema',
    disposicionEspacial: 'Lienzo principal de escala completa que contiene todas las regiones de la aplicación',
    disposicionVisual: 'Contenedor vertical a pantalla completa con ordenación flexible',
    disposicionInformacion: 'Ámbito global de experiencia, módulos, telemetría y estado de la aplicación',
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
        borders: {
            border: [
                'none',
                'subtle',
                'strong',
            ],
            borderBottom: [
                'none',
                'subtle',
                'strong',
            ],
            borderTop: [
                'none',
                'subtle',
                'strong',
            ],
            borderRight: [
                'none',
                'subtle',
                'strong',
            ],
            borderLeft: [
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
        description: 'Bloque estructural atómico para crear e instanciar áreas físicas en DOM',
    },
    {
        name: 'Direction',
        category: 'flow',
        description: 'Eje principal del layout: column para franjas apiladas verticalmente, row para columnas adyacentes horizontalmente',
        values: [
            'column',
            'row',
        ],
    },
    {
        name: 'Division',
        category: 'flow',
        description: 'Partición o división de columnas en cuadrícula: single, halves, thirds, quarters, sidebar-main, auto',
        values: [
            'single',
            'halves',
            'thirds',
            'quarters',
            'sidebar-main',
            'auto',
        ],
    },
    {
        name: 'Span',
        category: 'sizing',
        description: 'Cobertura de celdas del área hija en la cuadrícula: single, double, triple, full',
        values: [
            'single',
            'double',
            'triple',
            'full',
        ],
    },
    {
        name: 'Distribution',
        category: 'alignment',
        description: 'Distribución espacial a lo largo del eje principal',
        values: [
            'start',
            'center',
            'end',
            'between',
            'around',
            'evenly',
        ],
    },
    {
        name: 'Alignment',
        category: 'alignment',
        description: 'Alineación transversal de las áreas en el eje secundario',
        values: [
            'start',
            'center',
            'end',
            'stretch',
            'baseline',
        ],
    },
    {
        name: 'Spacing',
        category: 'spacing',
        description: 'Padding interior perimetral para evitar que el contenido toque los bordes del área',
        values: [
            'none',
            'small',
            'medium',
            'large',
            'xlarge',
        ],
    },
    {
        name: 'SpacingInline',
        category: 'spacing',
        description: 'Padding horizontal perimetral (ideal para header y footer: large)',
        values: [
            'none',
            'small',
            'medium',
            'large',
        ],
    },
    {
        name: 'Gap',
        category: 'spacing',
        description: 'Espacio de separación entre áreas hijas directas dentro del contenedor',
        values: [
            'none',
            'small',
            'medium',
            'large',
        ],
    },
    {
        name: 'Elasticity',
        category: 'sizing',
        description: 'Comportamiento elástico: fill (1 1 0%) para áreas principales, none (0 0 auto) para barras fijas',
        values: [
            'none',
            'fill',
            'grow',
            'shrink',
            'auto',
        ],
    },
    {
        name: 'Dimensions',
        category: 'sizing',
        description: 'Dimensiones dimensionales explícitas de ancho y alto según tokens de layout',
        values: [
            'full',
            'sidebar',
            'header',
            'footer',
            'auto',
            'compact',
            'regular',
        ],
    },
    {
        name: 'Surface',
        category: 'appearance',
        description: 'Superficie de fondo del área: default (#070A12), muted (#111624 para sidebar), card (#0d111c)',
        values: [
            'default',
            'muted',
            'card',
            'transparent',
        ],
    },
    {
        name: 'Borders',
        category: 'boundaries',
        description: 'Delimitación perimetral entre áreas: borderBottom (header), borderRight (sidebar), borderTop (footer)',
        values: [
            'none',
            'subtle',
            'strong',
        ],
    },
    {
        name: 'Overflow',
        category: 'containment',
        description: 'Aislamiento de scroll interno para áreas de trabajo y contenido',
        values: [
            'auto',
            'hidden',
            'visible',
            'scroll',
        ],
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

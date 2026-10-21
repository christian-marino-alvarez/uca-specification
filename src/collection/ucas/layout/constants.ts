export const __ID__ = 'layout';

export const DEFAULT_LIMIT = 4096;

export const DEFAULT_IMAGINATION = 0.2;

export const LAYOUT_GOAL =
    'Partition the current container strictly into its immediate direct child areas only (single-level partition). All areas must have parentId pointing to the current container. Do NOT emit grandchildren or deeper sub-areas; those are deferred to subsequent recursive layout steps.';

export const LAYOUT_PURPOSE =
    'Construct autonomous spatial layout area partition structures and hierarchies';

export const LAYOUT_INTENTION =
    'Estructurar exclusivamente las áreas hijas directas del contenedor actual (partición estricta de un solo nivel). En el contenedor body, particionar ÚNICAMENTE en sus 3 franjas hijas directas: header, workspace y footer (todas con parentId: body). Está estrictamente PROHIBIDO emitir sub-áreas nietas (como sidebar o main dentro de workspace) en esta pasada, ya que cada área hija será evaluada y particionada recursivamente en su propio ciclo.';

export const ROOT_AREA_ID = 'body';

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
        name: 'Elasticity',
        category: 'sizing',
        description: 'Comportamiento elástico: grow: 1 para ocupar espacio restante, shrink: 0 para preservar dimensiones fijas',
        values: [
            'grow',
            'shrink',
            'basis',
        ],
    },
    {
        name: 'Dimensions',
        category: 'sizing',
        description: 'Dimensiones dimensionales explícitas de ancho y alto',
        values: [
            '100%',
            '100dvh',
            'auto',
            'px',
            'rem',
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

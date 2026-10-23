export const __ID__ = 'render';

export const DEFAULT_CONTAINER = '#app';
export const DEFAULT_CHANNEL = 'root';
export const BATCH_SIZE = 4;
export const DEFAULT_SKELETON_KIND = 'container';
export const VIEWBOX_WIDTH = 800;

export const PALETTES = {
    dark: ':root{--surface:#111827;--edge:#1f2937;--line:#1e293b;--shimmer:#334155;--accent:#b88761}',
    light: ':root{--surface:#f8fafc;--edge:#e2e8f0;--line:#e2e8f0;--shimmer:#cbd5e1;--accent:#bf8458}',
} as const;

export const SKELETON_TEMPLATES: Readonly<
    Record<string, { height: number; elements: string }>
> = {
    header: {
        height: 64,
        elements:
            '<rect class="surface" x="1" y="1" width="798" height="62" rx="12"/><circle class="line" cx="40" cy="32" r="14"/><rect class="line" x="72" y="24" width="140" height="16" rx="8"/><rect class="line" x="620" y="22" width="70" height="20" rx="10"/><rect class="line" x="704" y="22" width="64" height="20" rx="10"/>',
    },
    main: {
        height: 280,
        elements:
            '<rect class="surface" x="1" y="1" width="798" height="278" rx="16"/><rect class="line" x="32" y="32" width="280" height="24" rx="12"/><rect class="line" x="32" y="72" width="460" height="14" rx="7"/><rect class="line" x="32" y="98" width="380" height="14" rx="7"/><rect class="surface" x="32" y="136" width="220" height="110" rx="12"/><rect class="surface" x="272" y="136" width="220" height="110" rx="12"/><rect class="surface" x="512" y="136" width="254" height="110" rx="12"/>',
    },
    footer: {
        height: 48,
        elements:
            '<rect class="surface" x="1" y="1" width="798" height="46" rx="8"/><rect class="line" x="300" y="18" width="200" height="12" rx="6"/>',
    },
    container: {
        height: 180,
        elements:
            '<rect class="surface" x="1" y="1" width="798" height="178" rx="14"/><rect class="line" x="32" y="32" width="240" height="20" rx="10"/><rect class="line" x="32" y="68" width="420" height="12" rx="6"/><rect class="line" x="32" y="92" width="340" height="12" rx="6"/>',
    },
};

export const COMPONENT_MAP: Readonly<Record<string, string>> = {
    action: 'action',
    button: 'action',
    btn: 'action',
    link: 'action',
    picture: 'picture',
    image: 'picture',
    img: 'picture',
    photo: 'picture',
    logo: 'picture',
    input: 'input',
    textfield: 'input',
    search: 'input',
    textarea: 'input',
    dropdown: 'choice',
    select: 'choice',
    combobox: 'choice',
    options: 'choice',
    radio: 'choice',
    checkbox: 'toggle',
    collection: 'collection',
    list: 'collection',
    table: 'collection',
    grid: 'collection',
    box: 'box',
    card: 'box',
    container: 'box',
    row: 'box',
    column: 'box',
    title: 'heading',
    text: 'paragraph',
    typography: 'paragraph',
    heading: 'heading',
    paragraph: 'paragraph',
    access: 'access',
    choice: 'choice',
    toggle: 'toggle',
    range: 'range',
    quantity: 'quantity',
    moment: 'moment',
    symbol: 'symbol',
    status: 'status',
    progress: 'progress',
    separator: 'separator',
} as const;

export const PRIMITIVE_INFORMATION_DISPOSITIONS: Readonly<Record<string, string>> = {
    box: 'Contenedor espacial y de flujo de descendientes; organiza, alinea y distribuye elementos hijos',
    card: 'Superficie estructurada M3; proyecta title, subtitle, media (imagen) y content',
    list: 'Colección estructurada de elementos homogéneos o secuenciales; proyecta items',
    heading: 'Título o encabezado de sección con nivel jerárquico; proyecta content o text',
    paragraph: 'Bloque de texto explicativo o narrativo; proyecta content o text',
    action: 'Disparador interactivo de comandos o acciones; proyecta label, icon y action',
    access: 'Enlace de navegación hacia un destino; proyecta label, href e icon',
    picture: 'Recurso visual de imagen o gráfico; proyecta src, alt, width y height',
    input: 'Campo de captura de datos de usuario; proyecta label, placeholder, value y type',
    separator: 'Delimitador visual entre secciones; proyecta orientación sin datos textuales',
    symbol: 'Icono o glifo semántico (Material Symbols); proyecta content (nombre del icono)',
    status: 'Indicador visual de estado o badge; proyecta label con variante de estado',
    progress: 'Indicador visual de avance o carga; proyecta value (porcentaje de completitud)',
    toggle: 'Control de conmutación booleana (on/off); proyecta label y value (booleano)',
    choice: 'Selector de opciones discretas (radio/select); proyecta options y value',
    range: 'Selector continuo en escala numérica; proyecta minimum, maximum, step y value',
    quantity: 'Campo de cantidad numérica con controles; proyecta minimum, maximum, step, unit y value',
    moment: 'Visualizador de fecha, hora o momento temporal; proyecta value y format',
    chip: 'Elemento compacto M3 de filtro, selección o metadato; proyecta label e icon',
    slider: 'Deslizador interactivo M3 de valor numérico; proyecta minimum, maximum, step y value',
    dialog: 'Ventana modal o diálogo de confirmación/alerta M3; proyecta title, content y actions',
};


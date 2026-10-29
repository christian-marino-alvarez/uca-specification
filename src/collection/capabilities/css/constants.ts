import type {
  DesignToken,
  PropertyMapping,
} from './types.js';

export const __ID__ = 'css';

export const AIM =
  'Aplicar hojas de estilo CSS basadas en W3C Design Tokens (DTCG), inyectando las variables raíz del sistema y reglas de estilo acotadas para elementos autónomos';

export const TOKENS_STYLE_ID = 'uca-tokens';

export const DESIGN_READY_PROPERTY = '--uca-design-ready';

export const STYLE_PREFIX = 'uca-style-';

export const IDENTIFIED_DESCENDANT_SELECTOR = '[id]';

export const DESIGN_TOKENS = {
  dimensions: {
    $type: 'dimension',
    auto: {
      $value: 'auto',
      $description: 'Tamaño intrínseco automático',
    },
    full: {
      $value: '100%',
      $description: 'Extensión completa del contenedor',
    },
    half: {
      $value: '50%',
      $description: 'Mitad de la extensión del contenedor',
    },
    third: {
      $value: '33.333%',
      $description: 'Un tercio de la extensión del contenedor',
    },
    'two-thirds': {
      $value: '66.666%',
      $description: 'Dos tercios de la extensión del contenedor',
    },
    quarter: {
      $value: '25%',
      $description: 'Un cuarto de la extensión del contenedor',
    },
    'three-quarters': {
      $value: '75%',
      $description: 'Tres cuartos de la extensión del contenedor',
    },
    narrow: {
      $value: '64px',
      $description: 'Extensión estrecha compacta',
    },
    compact: {
      $value: '260px',
      $description: 'Extensión de carril compacto',
    },
    regular: {
      $value: '320px',
      $description: 'Extensión de columna regular',
    },
    wide: {
      $value: '80%',
      $description: 'Extensión ancha del contenedor',
    },
    small: {
      $value: '2rem',
      $description: 'Dimensión de escala pequeña compacta',
    },
    medium: {
      $value: '2.5rem',
      $description: 'Dimensión de escala media de control',
    },
    large: {
      $value: '3.5rem',
      $description: 'Dimensión de escala grande de sección',
    },
    xlarge: {
      $value: '4rem',
      $description: 'Dimensión de escala extra grande',
    },
    screen: {
      $value: '100vh',
      $description: 'Altura completa del viewport',
    },
    content: {
      $value: 'fit-content',
      $description: 'Ajuste al contenido interno',
    },
  },
  flex: {
    $type: 'string',
    none: {
      $value: 'none',
      $description: 'Sin crecer ni encoger (0 0 auto)',
    },
    initial: {
      $value: 'initial',
      $description: 'No crecer, encoger si es necesario (0 1 auto)',
    },
    auto: {
      $value: 'auto',
      $description: 'Dimensionamiento flexible (1 1 auto)',
    },
    fill: {
      $value: '1 1 0%',
      $description: 'Rellenar el espacio disponible del contenedor equitativamente',
    },
    grow: {
      $value: '1 0 auto',
      $description: 'Crecer para absorber el espacio libre',
    },
    shrink: {
      $value: '0 1 auto',
      $description: 'Encoger si el espacio está restringido',
    },
  },
  overflow: {
    $type: 'string',
    visible: {
      $value: 'visible',
      $description: 'El contenido desborda los límites del contenedor',
    },
    hidden: {
      $value: 'hidden',
      $description: 'Contenido recortado en el límite del contenedor sin barras de desplazamiento',
    },
    auto: {
      $value: 'auto',
      $description: 'Las barras de desplazamiento aparecen automáticamente cuando el contenido desborda',
    },
    scroll: {
      $value: 'scroll',
      $description: 'Proporcionar siempre barras de desplazamiento',
    },
  },
  control: {
    $type: 'color',
    border: {
      $value: 'rgba(226, 232, 240, 0.16)',
      $description: 'Límite del control',
    },
    'border-hover': {
      $value: '#e2e8f0',
      $description: 'Límite del control al pasar el cursor',
    },
    placeholder: {
      $value: '#64748b',
      $description: 'Texto de marcador de posición',
    },
  },
  spacing: {
    $type: 'dimension',
    none: {
      $value: '0',
      $description: 'Sin espaciado',
    },
    small: {
      $value: '0.5rem',
      $description: 'Espaciado de densidad compacta',
    },
    medium: {
      $value: '1rem',
      $description: 'Espaciado base de layout',
    },
    large: {
      $value: '2rem',
      $description: 'Espaciado amplio de sección',
    },
    xlarge: {
      $value: '3rem',
      $description: 'Espaciado extendido',
    },
  },
  surface: {
    $type: 'color',
    transparent: {
      $value: 'transparent',
      $description: 'Superficie transparente que revela el área contenedora',
    },
    default: {
      $value: 'var(--md-sys-color-surface, #070a12)',
      $description: 'Fondo de superficie oscura mate por defecto',
    },
    surface: {
      $value: 'var(--md-sys-color-surface, #070a12)',
      $description: 'Superficie base M3',
    },
    surfaceContainer: {
      $value: 'var(--md-sys-color-surface-container, #111624)',
      $description: 'Contenedor de superficie M3',
    },
    surfaceContainerLow: {
      $value: 'var(--md-sys-color-surface-container-low, #0d111c)',
      $description: 'Contenedor de superficie baja M3',
    },
    surfaceContainerHigh: {
      $value: 'var(--md-sys-color-surface-container-high, #1a2030)',
      $description: 'Contenedor de superficie alta M3',
    },
    surfaceContainerLowest: {
      $value: 'var(--md-sys-color-surface-container-lowest, #05070c)',
      $description: 'Contenedor de superficie mínima M3',
    },
    surfaceContainerHighest: {
      $value: 'var(--md-sys-color-surface-container-highest, #232b3e)',
      $description: 'Contenedor de superficie máxima M3',
    },
    surfaceVariant: {
      $value: 'var(--md-sys-color-surface-variant, #2a344a)',
      $description: 'Variante de superficie M3',
    },
    primary: {
      $value: 'var(--md-sys-color-primary, #8ab4f8)',
      $description: 'Color de contenedor primario M3',
    },
    secondary: {
      $value: 'var(--md-sys-color-secondary, #3c4043)',
      $description: 'Color de contenedor secundario M3',
    },
    tertiary: {
      $value: 'var(--md-sys-color-tertiary, #80cbc4)',
      $description: 'Color de contenedor terciario M3',
    },
    card: {
      $value: 'var(--md-sys-color-surface-container-high, #0d111c)',
      $description: 'Superficie de tarjeta oscura en capas',
    },
    muted: {
      $value: 'var(--md-sys-color-surface-container, #111624)',
      $description: 'Superficie oscura sutil',
    },
    dark: {
      $value: 'var(--md-sys-color-surface-container-lowest, #05070c)',
      $description: 'Superficie oscura mate profunda',
    },
    brand: {
      $value: 'var(--md-sys-color-primary, #e2e8f0)',
      $description: 'Superficie de contraste de marca',
    },
    accent: {
      $value: 'var(--md-sys-color-secondary, #cbd5e1)',
      $description: 'Superficie de contraste secundaria',
    },
    danger: {
      $value: 'var(--md-sys-color-error, #f28b82)',
      $description: 'Superficie de advertencia o error',
    },
  },
  textColor: {
    $type: 'color',
    light: {
      $value: 'var(--md-sys-color-on-primary, #ffffff)',
      $description: 'Primer plano claro para superficies oscuras o de alto énfasis',
    },
    dark: {
      $value: 'var(--md-sys-color-on-surface, #202124)',
      $description: 'Primer plano oscuro de alto contraste para superficies claras',
    },
    muted: {
      $value: 'var(--md-sys-color-on-surface-variant, #5f6368)',
      $description: 'Primer plano secundario legible atenuado',
    },
    brand: {
      $value: 'var(--md-sys-color-primary, #1a73e8)',
      $description: 'Primer plano primario de marca',
    },
    accent: {
      $value: 'var(--md-sys-color-primary, #1a73e8)',
      $description: 'Primer plano de acento para enlaces y elementos interactivos',
    },
    danger: {
      $value: 'var(--md-sys-color-error, #d93025)',
      $description: 'Primer plano de contraste para advertencias',
    },
  },
  typeface: {
    $type: 'fontFamily',
    sans: {
      $value: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      $description: 'Tipografía sans-serif limpia',
    },
    serif: {
      $value: 'Georgia, Cambria, "Times New Roman", Times, serif',
      $description: 'Tipografía serif editorial',
    },
    mono: {
      $value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      $description: 'Tipografía monoespaciada de código',
    },
  },
  textSize: {
    $type: 'dimension',
    small: {
      $value: '0.875rem',
      $description: 'Escala de texto secundario pequeño',
    },
    medium: {
      $value: '1rem',
      $description: 'Escala de texto base de cuerpo',
    },
    large: {
      $value: '1.25rem',
      $description: 'Escala de texto de subtítulo',
    },
    title: {
      $value: '1.5rem',
      $description: 'Escala de texto de título prominente',
    },
    display: {
      $value: '2.25rem',
      $description: 'Escala de texto de visualización principal',
    },
  },
  fontWeight: {
    $type: 'fontWeight',
    normal: {
      $value: 400,
      $description: 'Peso de texto regular',
    },
    medium: {
      $value: 500,
      $description: 'Énfasis de texto medio',
    },
    semibold: {
      $value: 600,
      $description: 'Énfasis de texto seminegrita',
    },
    bold: {
      $value: 700,
      $description: 'Énfasis de texto en negrita',
    },
  },
  lineHeight: {
    $type: 'number',
    tight: {
      $value: 1.2,
      $description: 'Altura de línea compacta relativa al tamaño de fuente',
    },
    normal: {
      $value: 1.5,
      $description: 'Altura de línea estándar relativa al tamaño de fuente',
    },
    relaxed: {
      $value: 1.75,
      $description: 'Altura de línea amplia relativa al tamaño de fuente',
    },
  },
  textAlign: {
    $type: 'string',
    start: {
      $value: 'start',
      $description: 'Texto alineado al inicio de la dirección de escritura',
    },
    center: {
      $value: 'center',
      $description: 'Texto centrado dentro de su caja de línea',
    },
    end: {
      $value: 'end',
      $description: 'Texto alineado al final de la dirección de escritura',
    },
    justify: {
      $value: 'justify',
      $description: 'Texto distribuido uniformemente en la caja de línea',
    },
  },
  elevation: {
    $type: 'shadow',
    none: {
      $value: 'none',
      $description: 'Superficie plana sin sombra',
    },
    level0: {
      $value: 'none',
      $description: 'Superficie plana M3 0dp',
    },
    level1: {
      $value: 'var(--md-sys-elevation-level1, 0 1px 3px 1px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30))',
      $description: 'Elevación de tarjeta en reposo M3 1dp',
    },
    level2: {
      $value: 'var(--md-sys-elevation-level2, 0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30))',
      $description: 'Elevación de barra de navegación M3 3dp',
    },
    level3: {
      $value: 'var(--md-sys-elevation-level3, 0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.30))',
      $description: 'Elevación de diálogo M3 6dp',
    },
    level4: {
      $value: 'var(--md-sys-elevation-level4, 0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px 0 rgba(0, 0, 0, 0.30))',
      $description: 'Elevación de hoja flotante M3 8dp',
    },
    level5: {
      $value: 'var(--md-sys-elevation-level5, 0 8px 12px 6px rgba(0, 0, 0, 0.15), 0 4px 4px 0 rgba(0, 0, 0, 0.30))',
      $description: 'Elevación de barra superior M3 12dp',
    },
    low: {
      $value: 'var(--md-sys-elevation-level1, 0 1px 2px rgba(0, 0, 0, 0.05))',
      $description: 'Sombra de elevación sutil',
    },
    card: {
      $value: 'var(--md-sys-elevation-level1, 0 1px 3px rgba(0, 0, 0, 0.1))',
      $description: 'Sombra de elevación estándar de tarjeta',
    },
    medium: {
      $value: 'var(--md-sys-elevation-level2, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1))',
      $description: 'Sombra de elevación media',
    },
    modal: {
      $value: 'var(--md-sys-elevation-level3, 0 10px 15px rgba(0, 0, 0, 0.1))',
      $description: 'Sombra de elevación superpuesta modal',
    },
    high: {
      $value: 'var(--md-sys-elevation-level4, 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1))',
      $description: 'Sombra de alta elevación',
    },
  },
  shape: {
    $type: 'dimension',
    none: {
      $value: '0',
      $description: 'Esquinas rectas',
    },
    extraSmall: {
      $value: 'var(--md-sys-shape-corner-extra-small, 4px)',
      $description: 'Forma extra pequeña M3 4px',
    },
    small: {
      $value: 'var(--md-sys-shape-corner-small, 8px)',
      $description: 'Forma pequeña M3 8px',
    },
    medium: {
      $value: 'var(--md-sys-shape-corner-medium, 12px)',
      $description: 'Forma media de tarjeta M3 12px',
    },
    large: {
      $value: 'var(--md-sys-shape-corner-large, 16px)',
      $description: 'Forma grande de diálogo M3 16px',
    },
    extraLarge: {
      $value: 'var(--md-sys-shape-corner-extra-large, 28px)',
      $description: 'Forma extra grande de panel M3 28px',
    },
    full: {
      $value: 'var(--md-sys-shape-corner-full, 9999px)',
      $description: 'Forma de píldora completa M3 9999px',
    },
  },
  variant: {
    $type: 'string',
    elevated: {
      $value: 'elevated',
      $description: 'Variante de contenedor de superficie elevada M3',
    },
    filled: {
      $value: 'filled',
      $description: 'Variante rellena de alto énfasis M3',
    },
    tonal: {
      $value: 'tonal',
      $description: 'Variante tonal rellena de medio énfasis M3',
    },
    outlined: {
      $value: 'outlined',
      $description: 'Variante delimitada con contorno M3',
    },
    text: {
      $value: 'text',
      $description: 'Variante de solo texto de bajo énfasis M3',
    },
  },
  outline: {
    $type: 'border',
    none: {
      $value: 'none',
      $description: 'Sin contorno',
    },
    subtle: {
      $value: '1px solid var(--md-sys-color-outline-variant, rgba(226, 232, 240, 0.12))',
      $description: 'Variante de contorno sutil M3',
    },
    strong: {
      $value: '1px solid var(--md-sys-color-outline, rgba(226, 232, 240, 0.28))',
      $description: 'Contorno prominente M3',
    },
    dashed: {
      $value: '1px dashed var(--md-sys-color-outline-variant, rgba(226, 232, 240, 0.24))',
      $description: 'Contorno discontinuo M3 para marcadores de posición',
    },
  },
  direction: {
    $type: 'string',
    row: {
      $value: 'row',
      $description: 'Dirección de flujo horizontal',
    },
    column: {
      $value: 'column',
      $description: 'Dirección de flujo vertical',
    },
  },
  alignment: {
    $type: 'string',
    start: {
      $value: 'flex-start',
      $description: 'Alinear elementos al inicio del eje transversal',
    },
    center: {
      $value: 'center',
      $description: 'Alinear elementos al centro del eje transversal',
    },
    end: {
      $value: 'flex-end',
      $description: 'Alinear elementos al final del eje transversal',
    },
    stretch: {
      $value: 'stretch',
      $description: 'Estirar elementos a lo largo del eje transversal',
    },
    baseline: {
      $value: 'baseline',
      $description: 'Alinear elementos según la línea base del texto',
    },
  },
  distribution: {
    $type: 'string',
    start: {
      $value: 'flex-start',
      $description: 'Elementos agrupados al inicio del eje principal',
    },
    center: {
      $value: 'center',
      $description: 'Elementos centrados en el eje principal',
    },
    end: {
      $value: 'flex-end',
      $description: 'Elementos agrupados al final del eje principal',
    },
    between: {
      $value: 'space-between',
      $description: 'Espacio libre del eje principal distribuido entre elementos',
    },
    around: {
      $value: 'space-around',
      $description: 'Espacio libre del eje principal distribuido alrededor de los elementos',
    },
    evenly: {
      $value: 'space-evenly',
      $description: 'Espacios iguales en el eje principal entre elementos y en ambos extremos',
    },
  },
  wrap: {
    $type: 'string',
    nowrap: {
      $value: 'nowrap',
      $description: 'Mantener elementos en una sola línea flex',
    },
    wrap: {
      $value: 'wrap',
      $description: 'Permitir que los elementos salten a líneas flex adicionales',
    },
    reverse: {
      $value: 'wrap-reverse',
      $description: 'Saltar de línea invirtiendo el orden en el eje transversal',
    },
  },
  division: {
    $type: 'string',
    single: {
      $value: 'repeat(1, 1fr)',
      $description: 'Columna única continua de ancho completo',
    },
    halves: {
      $value: 'repeat(2, 1fr)',
      $description: 'Dos columnas proporcionales iguales',
    },
    thirds: {
      $value: 'repeat(3, 1fr)',
      $description: 'Tres columnas proporcionales iguales',
    },
    quarters: {
      $value: 'repeat(4, 1fr)',
      $description: 'Cuatro columnas proporcionales iguales',
    },
    'compact-fill': {
      $value: '260px 1fr',
      $description: 'Pista compacta fija junto a pista flexible',
    },
    'fill-compact': {
      $value: '1fr 260px',
      $description: 'Pista flexible junto a pista compacta fija',
    },
    'compact-fill-compact': {
      $value: '260px 1fr 260px',
      $description: 'Tres pistas: compacta fija, pista central flexible y compacta fija',
    },
    auto: {
      $value: 'repeat(auto-fit, minmax(240px, 1fr))',
      $description: 'Columnas adaptativas según el ancho disponible',
    },
  },
  span: {
    $type: 'string',
    single: {
      $value: 'span 1',
      $description: 'Abarcar una única celda de cuadrícula',
    },
    double: {
      $value: 'span 2',
      $description: 'Abarcar dos celdas de cuadrícula',
    },
    triple: {
      $value: 'span 3',
      $description: 'Abarcar tres celdas de cuadrícula',
    },
    full: {
      $value: '1 / -1',
      $description: 'Abarcar todas las columnas disponibles en la pista de cuadrícula',
    },
  },
} as const;

export const PROPERTY_MAPPINGS = [
  [
    'width',
    'dimensions',
    'width',
  ],
  [
    'height',
    'dimensions',
    'height',
  ],
  [
    'maxWidth',
    'dimensions',
    'max-width',
  ],
  [
    'minWidth',
    'dimensions',
    'min-width',
  ],
  [
    'minHeight',
    'dimensions',
    'min-height',
  ],
  [
    'spacing',
    'spacing',
    'padding',
  ],
  [
    'spacingInline',
    'spacing',
    'padding-inline',
  ],
  [
    'spacingBlock',
    'spacing',
    'padding-block',
  ],
  [
    'marginInline',
    'spacing',
    'margin-inline',
  ],
  [
    'marginBlock',
    'spacing',
    'margin-block',
  ],
  [
    'order',
    'order',
    'order',
  ],
  [
    'gap',
    'spacing',
    'gap',
  ],
  [
    'surface',
    'surface',
    'background-color',
  ],
  [
    'textColor',
    'textColor',
    'color',
  ],
  [
    'typeface',
    'typeface',
    'font-family',
  ],
  [
    'textSize',
    'textSize',
    'font-size',
  ],
  [
    'fontWeight',
    'fontWeight',
    'font-weight',
  ],
  [
    'lineHeight',
    'lineHeight',
    'line-height',
  ],
  [
    'textAlign',
    'textAlign',
    'text-align',
  ],
  [
    'elevation',
    'elevation',
    'box-shadow',
  ],
  [
    'shape',
    'shape',
    'border-radius',
  ],
  [
    'outline',
    'outline',
    'border',
  ],
  [
    'outlineBottom',
    'outline',
    'border-bottom',
  ],
  [
    'outlineTop',
    'outline',
    'border-top',
  ],
  [
    'outlineRight',
    'outline',
    'border-right',
  ],
  [
    'outlineLeft',
    'outline',
    'border-left',
  ],
  [
    'direction',
    'direction',
    'flex-direction',
  ],
  [
    'alignment',
    'alignment',
    'align-items',
  ],
  [
    'distribution',
    'distribution',
    'justify-content',
  ],
  [
    'wrap',
    'wrap',
    'flex-wrap',
  ],
  [
    'division',
    'division',
    'grid-template-columns',
  ],
  [
    'span',
    'span',
    'grid-column',
  ],
  [
    'flex',
    'flex',
    'flex',
  ],
  [
    'overflow',
    'overflow',
    'overflow',
  ],
] as const satisfies readonly PropertyMapping[];

export const BASE_STYLES = [
  '*, *::before, *::after { box-sizing: border-box; }',
  'html, body { width: 100%; height: 100%; min-block-size: 100vh; margin: 0; }',
  'body { display: flex; flex-direction: column; min-block-size: 100vh; background-color: var(--uca-surface-default, #070a12); color: var(--uca-textColor-light, #ffffff); }',
  'h1, h2, h3, h4, h5, h6, p, ul, ol, menu, figure, blockquote { margin: 0; }',
  'ul, ol, menu { padding: 0; list-style: none; }',
  'img, svg, video, canvas { max-width: 100%; height: auto; display: block; }',
  'input, button, select, textarea, a { font: inherit; color: inherit; background: transparent; border: none; padding: 0; margin: 0; text-decoration: none; outline: none; box-sizing: border-box; }',
  'input:focus-visible, button:focus-visible, select:focus-visible, textarea:focus-visible, a:focus-visible { outline: auto; }',
  'input:disabled, button:disabled, select:disabled, textarea:disabled { cursor: not-allowed; }',
].join(' ');

export const TOKEN_VARIABLES: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(DESIGN_TOKENS).flatMap(([
    category,
    group,
  ]) => Object.entries(group)
    .filter(([
      name,
    ]) => !name.startsWith('$'))
    .map(([
      name,
      token,
    ]) => [
      `${category}:${name}`,
      `var(--uca-${category}-${name}, ${String((token as DesignToken<string | number>).$value)})`,
    ])),
);

export const TOKENS_STYLESHEET = `:root { ${DESIGN_READY_PROPERTY}: 1; ${Object.entries(DESIGN_TOKENS).flatMap(([
  category,
  group,
]) => Object.entries(group)
  .filter(([
    name,
  ]) => !name.startsWith('$'))
  .map(([
    name,
    token,
  ]) => `--uca-${category}-${name}: ${String((token as DesignToken<string | number>).$value)};`)).join(' ')} } ${BASE_STYLES}`;

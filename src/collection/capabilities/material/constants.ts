import type {
  CanonicalLayouts,
  ComponentKind,
  Dimensions,
  MaterialModel,
  SpatialPrinciples,
  WindowSizeClass,
  WindowSizeRule,
} from './types.js';

export const __ID__ = 'material';

export const AIM =
  'Proporcionar el sistema de distribución espacial, clases de tamaño de ventana, diseños canónicos y cualidades de componentes de Material Design 3 (M3)';

export const COMPACT_MAX_WIDTH = 599;

export const MEDIUM_MAX_WIDTH = 839;

export const DEFAULT_DIMENSIONS: Dimensions = {
  width: 1024,
  height: 768,
};

export const WINDOW_SIZE_RULES: Readonly<Record<WindowSizeClass, WindowSizeRule>> = {
  compact: {
    windowSizeClass: 'compact',
    breakpoint: '< 600px',
    columns: 4,
    margin: '16px (spacing: medium)',
    spacer: '16px (gap: medium)',
    recommendedDivision: 'single',
    pattern:
      'Capacidad de 4 columnas: distribución apilada en flujo único (direction: column) priorizando la lectura secuencial sin columnas paralelas que compriman el ancho útil',
  },
  medium: {
    windowSizeClass: 'medium',
    breakpoint: '600px - 839px',
    columns: 8,
    margin: '24px (spacing: large)',
    spacer: '24px (gap: large)',
    recommendedDivision: 'halves | compact-fill',
    pattern:
      'Capacidad de 8 columnas: permite articular áreas complementarias en paralelo con proporciones asimétricas o equilibradas según la densidad de contenido',
  },
  expanded: {
    windowSizeClass: 'expanded',
    breakpoint: '>= 840px',
    columns: 12,
    margin: '24px (spacing: large)',
    spacer: '24px (gap: large)',
    recommendedDivision: 'compact-fill-compact | compact-fill | thirds | quarters | auto',
    pattern:
      'Capacidad de 12 columnas: habilita composiciones multipanel simultáneas donde múltiples áreas funcionales coexisten en el mismo plano visual, distribuyendo el ancho y el alto según el peso semántico de cada responsabilidad',
  },
};

export const CANONICAL_LAYOUTS: CanonicalLayouts = {
  supportingPane:
    'Panel de soporte: articula un área operativa dominante (flex: fill) junto a áreas complementarias acotadas (width: compact o regular, flex: none) para funciones de apoyo, control o contexto simultáneo',
  listDetail:
    'Maestro-detalle: coordina áreas de exploración o selección estructural con áreas de proyección y trabajo detallado en paralelo',
  feed:
    'Cuadrícula fluida: distribuye múltiples áreas homogéneas o modulares en pistas proporcionales (division: halves, thirds, quarters o auto con gap: medium o large)',
};

export const SPATIAL_PRINCIPLES: SpatialPrinciples = {
  containment:
    'Contención estricta en el espacio disponible del contenedor (overflow: hidden en contenedores estructurales; overflow: auto únicamente en áreas terminales de contenido)',
  gravitationalBalance:
    'Equilibrio gravitacional: las áreas de mayor carga operativa absorben el espacio elástico (flex: fill), mientras las áreas de control, contexto o soporte mantienen dimensiones acotadas (flex: none)',
  surfaceHierarchy:
    'Jerarquía tonal M3 mediante contraste de superficies: lienzo base en surface/default, áreas contenedoras en surfaceContainerLow/surfaceContainer y áreas destacadas en surfaceContainerHigh/card con shape: medium o large y outline: subtle',
  spacingAndSpacers:
    'Ritmo espacial M3: separación entre áreas hermanas mediante gap (small, medium o large) y margen interno mediante spacing (small, medium o large)',
};

export const DEFAULT_MATERIAL_MODEL: MaterialModel = {
  specification: 'Sistema de Distribución Espacial y Diseños Canónicos de Material Design 3 (M3)',
  philosophy:
    'Distribuir el espacio disponible del contenedor en áreas ergonómicas y proporcionadas según la clase de tamaño de ventana, los diseños canónicos y la jerarquía tonal de superficies de Material Design 3.',
  windowSizeRule: WINDOW_SIZE_RULES.expanded,
  canonicalLayouts: CANONICAL_LAYOUTS,
  spatialPrinciples: SPATIAL_PRINCIPLES,
};

export const COMPONENT_QUALITIES: Readonly<Record<ComponentKind, Readonly<Record<string, string>>>> = {
  access: {
    alignment: 'center',
    fontWeight: 'medium',
    textColor: 'brand',
    textSize: 'small',
  },
  action: {
    alignment: 'center',
    distribution: 'center',
    fontWeight: 'medium',
    outline: 'subtle',
    shape: 'full',
    spacingBlock: 'small',
    spacingInline: 'medium',
    surface: 'surfaceContainerHigh',
    textColor: 'light',
    textSize: 'small',
  },
  box: {
    gap: 'small',
  },
  card: {
    direction: 'column',
    elevation: 'level1',
    gap: 'small',
    outline: 'subtle',
    shape: 'medium',
    spacing: 'medium',
    surface: 'surfaceContainerHigh',
    textColor: 'light',
  },
  chip: {
    alignment: 'center',
    fontWeight: 'medium',
    outline: 'subtle',
    shape: 'full',
    spacingBlock: 'small',
    spacingInline: 'small',
    surface: 'surfaceContainerHigh',
    textColor: 'light',
    textSize: 'small',
    width: 'content',
  },
  choice: {
    outline: 'subtle',
    shape: 'small',
    spacingBlock: 'small',
    spacingInline: 'medium',
    surface: 'surfaceContainerLow',
    textColor: 'light',
    textSize: 'small',
    width: 'full',
  },
  dialog: {
    direction: 'column',
    elevation: 'level3',
    gap: 'medium',
    outline: 'subtle',
    shape: 'extraLarge',
    spacing: 'large',
    surface: 'surfaceContainerHighest',
    textColor: 'light',
  },
  heading: {
    fontWeight: 'bold',
    lineHeight: 'tight',
    textColor: 'light',
    textSize: 'title',
  },
  input: {
    outline: 'subtle',
    shape: 'small',
    spacingBlock: 'small',
    spacingInline: 'medium',
    surface: 'surfaceContainerLow',
    textColor: 'light',
    textSize: 'small',
    width: 'regular',
  },
  list: {
    direction: 'column',
    gap: 'small',
    textColor: 'light',
    width: 'full',
  },
  moment: {
    outline: 'subtle',
    shape: 'small',
    spacingBlock: 'small',
    spacingInline: 'medium',
    surface: 'surfaceContainerLow',
    textColor: 'light',
    textSize: 'small',
    width: 'full',
  },
  paragraph: {
    fontWeight: 'normal',
    lineHeight: 'relaxed',
    textColor: 'light',
    textSize: 'medium',
  },
  picture: {
    overflow: 'hidden',
    shape: 'medium',
    width: 'full',
  },
  progress: {
    shape: 'full',
    width: 'full',
  },
  quantity: {
    outline: 'subtle',
    shape: 'small',
    spacingBlock: 'small',
    spacingInline: 'medium',
    surface: 'surfaceContainerLow',
    textColor: 'light',
    textSize: 'small',
    width: 'full',
  },
  range: {
    width: 'full',
  },
  separator: {
    outlineBottom: 'subtle',
    width: 'full',
  },
  slider: {
    width: 'full',
  },
  status: {
    alignment: 'center',
    fontWeight: 'medium',
    outline: 'subtle',
    shape: 'full',
    spacingBlock: 'small',
    spacingInline: 'small',
    surface: 'surfaceContainerHigh',
    textColor: 'light',
    textSize: 'small',
    width: 'content',
  },
  symbol: {
    alignment: 'center',
    distribution: 'center',
    fontWeight: 'medium',
    lineHeight: 'tight',
    textColor: 'light',
    textSize: 'medium',
  },
  toast: {
    alignment: 'center',
    direction: 'row',
    distribution: 'between',
    elevation: 'level3',
    gap: 'medium',
    outline: 'subtle',
    shape: 'medium',
    spacingBlock: 'small',
    spacingInline: 'medium',
    surface: 'surfaceContainerHighest',
    textColor: 'light',
    textSize: 'small',
  },
  toggle: {
    alignment: 'center',
    shape: 'small',
  },
};

export const HEADING_IMPORTANCE_QUALITIES: Readonly<Record<number, Readonly<Record<string, string>>>> = {
  1: {
    fontWeight: 'bold',
    lineHeight: 'tight',
    textSize: 'display',
  },
  2: {
    fontWeight: 'semibold',
    lineHeight: 'tight',
    textSize: 'title',
  },
  3: {
    fontWeight: 'semibold',
    lineHeight: 'tight',
    textSize: 'large',
  },
  4: {
    fontWeight: 'medium',
    lineHeight: 'normal',
    textSize: 'medium',
  },
  5: {
    fontWeight: 'medium',
    lineHeight: 'normal',
    textSize: 'small',
  },
  6: {
    fontWeight: 'medium',
    lineHeight: 'normal',
    textSize: 'small',
  },
};

export const VARIANT_QUALITIES: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  elevated: {
    elevation: 'level1',
    surface: 'surfaceContainerLow',
    textColor: 'light',
  },
  filled: {
    surface: 'primary',
    textColor: 'dark',
  },
  outlined: {
    outline: 'strong',
    surface: 'transparent',
    textColor: 'light',
  },
  text: {
    surface: 'transparent',
    textColor: 'brand',
  },
  tonal: {
    surface: 'surfaceVariant',
    textColor: 'light',
  },
};

export const TONE_QUALITIES: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  brand: {
    surface: 'primary',
    textColor: 'dark',
  },
  danger: {
    surface: 'danger',
    textColor: 'dark',
  },
  error: {
    surface: 'danger',
    textColor: 'dark',
  },
  info: {
    surface: 'surfaceContainerHigh',
    textColor: 'light',
  },
  neutral: {
    surface: 'surfaceContainerHigh',
    textColor: 'light',
  },
  success: {
    surface: 'tertiary',
    textColor: 'dark',
  },
  warning: {
    surface: 'surfaceVariant',
    textColor: 'light',
  },
};

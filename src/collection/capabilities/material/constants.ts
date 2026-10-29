import type {
  CanonicalLayouts,
  Dimensions,
  MaterialModel,
  SpatialPrinciples,
  WindowSizeClass,
  WindowSizeRule,
} from './types.js';

export const __ID__ = 'material';

export const AIM =
  'Proporcionar el sistema de distribución espacial, clases de tamaño de ventana, diseños canónicos y principios geométricos de Material Design 3 (M3) según las dimensiones disponibles del contenedor';

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

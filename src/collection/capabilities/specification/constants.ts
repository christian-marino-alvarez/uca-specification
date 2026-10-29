import type {
  Audience,
  SpecificationModel,
  VisualDispositions,
} from './types.js';

export const __ID__ = 'specification';

export const AIM =
  'Proporcionar el modelo de especificación ontológica, funcional y experiencial de la aplicación a los agentes y modelos cognitivos';

export const DEFAULT_TONE =
  'Didáctico, expresivo, ágil y conceptualmente riguroso, inspirado en la claridad editorial e interactiva de Material Design 3.';

export const DEFAULT_INTERACTIVE_FEATURES: readonly string[] = [
  'Árbol reactivo de componentes e inspección de disposiciones vivas',
  'Visualizador en tiempo real del flujo de impulsos y estímulos nerviosos',
  'Mutación interactiva de disposiciones con reconciliación idempotente',
  'Adaptación perceptual según fase horaria y entorno geográfico',
] as const;

export const DEFAULT_VISUAL_DISPOSITIONS: VisualDispositions = {
  density: 'comfortable',
  contrastMode: 'tonal-surfaces-m3',
  paletteIntent:
    'Diseño y estructura inspirados en la plataforma oficial de Material Design 3 (m3.material.io): jerarquía tonal de superficies (surface, surfaceContainerLow, surfaceContainer, surfaceContainerHigh), acentos expresivos (primary, secondary, tertiary), contenedores generosamente redondeados (shape: large y extraLarge) y separación limpia mediante contraste de superficies y gap',
  dynamicPrinciples: [
    'Arquitectura espacial estilo Material Design 3 con navegación estructural persistente y un lienzo multipanel expresivo de tarjetas y contenedores interactivos redondeados.',
    'La interfaz emerge dinámicamente de la interacción y del estado ontológico; no existen páginas estáticas.',
    'Cada acción del usuario emite impulsos nerviosos que recomponen la vista en tiempo real.',
    'La aplicación modula su presencia estética según el momento del día y la localización del observador.',
  ],
  dayPeriodAdaptation: true,
  locationAdaptation: true,
  supportedDevices: [
    'desktop',
    'tablet',
    'mobile',
  ],
};

export const DEFAULT_AUDIENCE: Audience = {
  profile: [
    'Desarrolladores',
    'Diseñadores',
    'Arquitectos de Software e IA',
  ],
  cognitiveGoal:
    'Comprobar empíricamente que la arquitectura UCA es un paradigma real, reactivo y viable para sistemas cognitivos.',
};

export const DEFAULT_LIMITS: readonly string[] = [
  'Contención estricta en el viewport disponible (100dvh) sin barras de desplazamiento globales (cero scroll en raíz)',
  'Fidelidad estructural y estética al lenguaje de diseño de Material Design 3 (jerarquía tonal de superficies, formas redondeadas expresivas y ritmo espacial coherente)',
  'Ausencia total de páginas estáticas; la interfaz emerge dinámicamente del flujo reactivo de señales',
  'Jerarquía espacial de nivel único por contenedor, particionando exclusivamente en áreas hijas directas',
] as const;

export const DEFAULT_SPECIFICATION_MODEL: SpecificationModel = {
  purpose:
    'Demostrar empíricamente que la arquitectura UCA es real, reactiva y funcional mediante la ejecución autorreferencial de la propia aplicación.',
  intention:
    'Constituir un entorno interactivo y dinámico con el diseño y la estructura espacial de la página de Material Design 3 (navegación lateral persistente, cabecera expresiva y paneles modulares redondeados en cuadrícula), donde desarrolladores, diseñadores y arquitectos experimenten la reactividad ontológica, inspeccionen el flujo de señales en tiempo real y comprueben la ausencia de dependencias imperativas tradicionales.',
  tone: DEFAULT_TONE,
  interactiveFeatures: [
    ...DEFAULT_INTERACTIVE_FEATURES,
  ],
  visualDispositions: DEFAULT_VISUAL_DISPOSITIONS,
  audience: DEFAULT_AUDIENCE,
  limits: [
    ...DEFAULT_LIMITS,
  ],
};

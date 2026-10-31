import type {
  Audience,
  SpecificationModel,
  VisualDispositions,
} from './types.js';

export const __ID__ = 'specification';

export const AIM =
  'Proporcionar el modelo de especificación ontológica, funcional y experiencial de la aplicación a los agentes y modelos cognitivos';

export const DEFAULT_TONE =
  'Didáctico, expresivo, visualmente rico y conceptualmente riguroso, inspirado en la estética editorial, icónica e interactiva del portal oficial de Material Design 3 (m3.material.io).';

export const DEFAULT_INTERACTIVE_FEATURES: readonly string[] = [
  'Navegación estructural Material Design 3 con menús interactivos (access, action, list), iconos expresivos (symbol) y filtros (chip) para explorar las partes fundamentales de la arquitectura UCA (Uca, Capability, Disposition, Signal, Cooky)',
  'Sección principal (Hero) y tarjetas modulares (card) estilo Material Design 3 que presentan la anatomía de UCA (propósito inmutable, intención modulada, inervación y catálogo Cooky) emergiendo en vivo desde la propia arquitectura',
  'Galería visual enriquecida con iconos (symbol), indicadores de estado (status, progress), píldoras (chip) y listas estructuradas (list) que explican cómo el sistema nervioso reactivo (Signal, pulse, react) da vida a esta misma web en tiempo real',
  'Escaparate interactivo de controles y componentes Material Design 3 (action, input, toggle, choice, slider) donde cada elemento visual es simultáneamente parte de la documentación y un ejemplar vivo de UCA autónoma ejecutándose en la página',
] as const;

export const DEFAULT_VISUAL_DISPOSITIONS: VisualDispositions = {
  density: 'comfortable',
  contrastMode: 'tonal-surfaces-m3',
  paletteIntent:
    'Diseño, iconografía y arquitectura visual inspirados en la web oficial de Material Design 3 (m3.material.io): menús de navegación con iconos (symbol), jerarquía tonal de superficies (surface, surfaceContainerLow, surfaceContainer, surfaceContainerHigh), acentos expresivos (primary, secondary, tertiary), tarjetas y contenedores generosamente redondeados (shape: large y extraLarge) y uso rico de elementos visuales Material Design',
  dynamicPrinciples: [
    'La web emerge dinámicamente en tiempo real porque está construida íntegramente con la propia arquitectura UCA, siendo simultáneamente la documentación visual de sus partes y un ejemplo vivo y autorreferencial de la arquitectura en acción.',
    'Arquitectura espacial estilo Material Design 3 (m3.material.io) articulada con menús de navegación laterales o superiores con iconos, cabecera expresiva y un lienzo modular de tarjetas, chips, símbolos y controles interactivos.',
    'Cada menú, icono, tarjeta, filtro y control visual que explica las piezas de UCA (Uca, Capability, Disposition, Signal, Cooky) es en sí mismo una UCA real reaccionando a impulsos nerviosos sin plantillas HTML estáticas.',
    'La aplicación modula su presencia estética según el momento del día y la localización del observador manteniendo el equilibrio visual dentro del viewport.',
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
    'Diseñadores de Sistemas',
    'Arquitectos de Software e IA',
  ],
  cognitiveGoal:
    'Comprender visual y prácticamente todas las piezas de la arquitectura UCA explorando una web estilo Material Design 3 que emerge en vivo como ejemplo autorreferencial construido con la propia arquitectura.',
};

export const DEFAULT_LIMITS: readonly string[] = [
  'Contención estricta en el viewport disponible (100dvh) sin barras de desplazamiento globales (cero scroll en raíz)',
  'Estética y riqueza visual fiel a Material Design 3 (m3.material.io) mediante el uso expresivo de iconos (symbol), menús (access, list), tarjetas (card), chips (chip) e indicadores (status, progress)',
  'Emergencia autorreferencial real: prohibido simular páginas estáticas; cada sección que explica la arquitectura UCA emerge dinámicamente de las propias UCAs que componen la web',
  'Jerarquía espacial de nivel único por contenedor, particionando exclusivamente en áreas hijas directas con proporciones armónicas',
] as const;

export const DEFAULT_SPECIFICATION_MODEL: SpecificationModel = {
  purpose:
    'Presentar y explicar de forma visual e interactiva las partes que componen la arquitectura UCA (Uca, Capability, Disposition, Signal, Cooky, pulse y react) a través de una web estilo Material Design 3 que emerge en tiempo real al estar construida con la propia arquitectura UCA como ejemplo vivo y autorreferencial.',
  intention:
    'Articular una experiencia web inspirada en el portal de Material Design 3 (m3.material.io) rica en iconos (symbol), menús de navegación (access, action, list), tarjetas expresivas (card), píldoras interactivas (chip), indicadores (status, progress) y controles (input, toggle, choice, slider), donde cada sección muestre con claridad las piezas ontológicas de UCA mientras la propia interfaz emerge dinámicamente de esas mismas UCAs en ejecución.',
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

import { DispositionSignal } from '@uca/core/types';
import { SignalType as SessionSignalType } from '@uca/capability-session/types';
import { SignalType as MemorySignalType } from '@uca/capability-memory/types';
import { SignalType as NavigateSignalType } from '@uca/navigate/types';
import { SignalType as CompositionSignalType } from '@uca/composition/types';
import { SignalType as SpecificationSignalType } from '@uca/capability-specification/types';
import { SignalType as DecisionSignalType } from '@uca/decision/types';
import { SignalType as LlmSignalType } from '@uca/llm/types';

export const __ID__ = 'app';

export const TELEMETRY_OBSERVED_SIGNALS = [
  DispositionSignal.INNERVATED,
  DispositionSignal.UPDATED,
  SessionSignalType.GET,
  SessionSignalType.RETRIEVED,
  SessionSignalType.CREATE,
  SessionSignalType.CREATED,
  NavigateSignalType.INIT,
  NavigateSignalType.GO,
  NavigateSignalType.CHANGED,
  NavigateSignalType.DESTROY,
  MemorySignalType.GET,
  MemorySignalType.SET,
  MemorySignalType.CLEAR,
  MemorySignalType.RETRIEVED,
  MemorySignalType.SAVED,
  MemorySignalType.CLEARED,
  CompositionSignalType.COMPOSE,
  CompositionSignalType.ERROR,
  SpecificationSignalType.QUERY,
  SpecificationSignalType.PROVIDED,
  SpecificationSignalType.ERROR,
  DecisionSignalType.DECIDE,
  DecisionSignalType.DECIDED,
  DecisionSignalType.ERROR,
  LlmSignalType.INFER,
  LlmSignalType.INFERRED,
  LlmSignalType.ERROR,
] as const;

export const DEFAULT_PAGE = '/';

export const DEFAULT_PURPOSE =
  'Constituir la manifestación viva y emergente de la Arquitectura Cognitiva Universal (UCA): una experiencia interactiva disruptiva donde la propia aplicación es la demostración en tiempo real de su propia arquitectura ontológica';

export const DEFAULT_AIM_DESCRIPTION =
  'Materializar una aplicación interactiva que evite scrolls trabajando exclusivamente con el área y viewport disponibles (100dvh con contención estricta), concibiendo una experiencia viva y exploratoria donde la interacción misma explica y demuestra la Arquitectura Cognitiva Universal (UCA), constituyendo la propia aplicación una demo en vivo de lo que es UCA (ontología viva, inervación de capacidades y flujo reactivo sin estado mutable).';

export const DEFAULT_DESIGN_GUIDELINES =
  'Directrices de diseño (Sistema Emergente Universal y Viewport Bicromático Positivo/Negativo): 1) Paleta Estricta de 2 Colores Positivo/Negativo: Exclusivamente dos colores en toda la aplicación: oscuro mate profundo (#070A12) para todas las superficies y fondos (negativo), y blanco grisáceo (#e2e8f0, #cbd5e1, #94a3b8) para todos los textos, bordes, controles y elementos activos (positivo). Estrictamente PROHIBIDO el blanco puro (#ffffff), textos oscuros sobre fondos oscuros o colores cromáticos (azules, naranjas, rojos o amarillos). El contraste se produce mediante opacidad (#e2e8f0 para textos primarios y acciones de marca, #94a3b8 para textos secundarios, rgba(226, 232, 240, 0.12) para bordes sutiles y tarjetas). 2) Cero Scroll e Integridad de Flujo: Contención estricta de 100dvh sin barras de desplazamiento. PROHIBIDO usar "position: fixed", "position: sticky" o "height: 100vh" en componentes internos. Basarse exclusivamente en el flujo natural de flexbox ("direction", "alignment", "distribution", "wrap: nowrap"). 3) Jerarquía Estricta de Nivel Único: Cada paso de layout particiona exclusivamente un contenedor en sus hijos directos. El contenedor raíz (body) se particiona únicamente en sus 3 franjas hijas directas: cabecera superior (direction: row, height: auto), fila central de espacio de trabajo (direction: row, flex: 1) y pie compacto (direction: row, height: auto). Nunca emitir subáreas anidadas durante el pase de layout raíz. 4) Demo Interactiva en Vivo de UCA: La interfaz sirve como manifestación interactiva viva que explica y demuestra la propia Arquitectura Cognitiva Universal (UCA Core): percepción, decisión, inervación, capacidades y señales. 5) Controles y Tarjetas: Los botones usan superficie "brand" (blanco grisáceo) con textColor "dark" (#070A12) para acciones primarias, o superficie "transparent" con outline "subtle" y textColor "light" para acciones secundarias. Las tarjetas usan superficie "card" (#0d111c) con outline "subtle" y shape "large".';

export const DEFAULT_STRUCTURAL_DISPOSITION = {
  containerElement: 'body',
  rootArea: 'body',
  containment: 'strict',
} as const;

export const DEFAULT_SPATIAL_DISPOSITION = {
  flow: 'column',
  height: '100%',
  width: '100%',
  overflow: 'hidden',
} as const;

export const DEFAULT_DESIGN_DISPOSITION = {
  palette: 'two-color-contrast',
  surfaceDefault: '#070A12',
  textColorBrand: '#e2e8f0',
  guidelines: DEFAULT_DESIGN_GUIDELINES,
} as const;

export const DEFAULT_AIM_BODY = {
  activePage: DEFAULT_PAGE,
  structural: DEFAULT_STRUCTURAL_DISPOSITION,
  spatial: DEFAULT_SPATIAL_DISPOSITION,
  design: DEFAULT_DESIGN_DISPOSITION,
} as const;

import {
  QuestionType,
  type OptionItem,
  type Question,
} from '@uca/decision/types';
import type { AreaTarget } from './types.js';

export const __ID__ = 'composition';

export const DEFAULT_PURPOSE =
  'Orquestar la composición cognitiva de la interfaz consultando la especificación del sistema y decidiendo probabilísticamente entre partición espacial (Layout) o articulación de componentes (View)';

export const DEFAULT_URL = '/';

export const DEFAULT_AREA_ID = 'body';

export const DEFAULT_ROOT_AREA_LIMITS: readonly string[] = [
  'Contención estricta de 100dvh sin barras de desplazamiento (cero scroll)',
  'Partición espacial únicamente en áreas hijas directas de primer nivel',
] as const;

export const DEFAULT_ROOT_AREA: AreaTarget = {
  id: DEFAULT_AREA_ID,
  dimensions: {
    flow: 'column',
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  limits: [
    ...DEFAULT_ROOT_AREA_LIMITS,
  ],
};

export const SPECIFICATION_DECISION_KEYS: readonly string[] = [
  'purpose',
  'intention',
  'interactiveFeatures',
  'limits',
] as const;

export const ROOT_DECISION_OPTIONS: readonly OptionItem[] = [
  {
    id: 'LAYOUT',
    label: 'Layout',
    description: 'Estructuración espacial de la aplicación en áreas funcionales',
    criteria:
      'Elegir LAYOUT para estructurar la aplicación en áreas funcionales principales (cabecera, navegación, espacio de trabajo, barra lateral, contenido y pie).',
  },
  {
    id: 'VIEW',
    label: 'View',
    description: 'Composición directa unitaria sin áreas estructurales',
    criteria:
      'Elegir VIEW únicamente si la aplicación completa es una vista única, simple y sin partición de áreas estructurales.',
  },
] as const;

export const AREA_DECISION_OPTIONS: readonly OptionItem[] = [
  {
    id: 'LAYOUT',
    label: 'Layout',
    description: 'Subdivisión espacial en áreas funcionales internas',
    criteria:
      'Elegir LAYOUT obligatoriamente cuando el área sea un espacio de trabajo contenedor (como workspace) que deba particionarse en barra lateral y área principal, o requiera ejes estructurales independientes.',
  },
  {
    id: 'VIEW',
    label: 'View',
    description: 'Composición directa de componentes visuales',
    criteria:
      'Elegir VIEW cuando el área sea terminal (cabecera, barra lateral individual, contenido principal individual o pie) y deba materializar sus componentes visuales directos.',
  },
] as const;

export const ROOT_DECISION_QUESTION: Question = {
  id: 'composition_root_mode',
  type: QuestionType.CHOICE,
  prompt: 'Determina si la superficie principal debe articularse mediante un LAYOUT estructural en áreas o como una VIEW unitaria según la especificación y la ruta activa.',
  options: [
    ...ROOT_DECISION_OPTIONS,
  ],
};

export const AREA_DECISION_QUESTION: Question = {
  id: 'composition_area_mode',
  type: QuestionType.CHOICE,
  prompt: 'Determina si el área contenedora debe subdividirse mediante un LAYOUT estructural o poblarse como una VIEW terminal de componentes.',
  options: [
    ...AREA_DECISION_OPTIONS,
  ],
};

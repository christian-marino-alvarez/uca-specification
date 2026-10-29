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

export const DEFAULT_ROOT_AREA: AreaTarget = {
  id: DEFAULT_AREA_ID,
  purpose: 'Contenedor raíz y lienzo global de la aplicación',
  intention: 'Albergar y estructurar las áreas espaciales directas del sistema',
};

export const ROOT_DECISION_OPTIONS: readonly OptionItem[] = [
  {
    id: 'LAYOUT',
    label: 'Layout',
    description: 'Partición espacial del contenedor en múltiples áreas funcionales complementarias',
    criteria:
      'Elegir LAYOUT cuando la complejidad funcional de la especificación requiera dividir el contenedor en múltiples áreas diferenciadas con responsabilidades y proporciones propias.',
  },
  {
    id: 'VIEW',
    label: 'View',
    description: 'Articulación directa de componentes visuales en una única superficie sin subdivisión de áreas',
    criteria:
      'Elegir VIEW únicamente cuando la especificación completa pueda resolverse en un único contenedor terminal sin partición espacial.',
  },
] as const;

export const AREA_DECISION_OPTIONS: readonly OptionItem[] = [
  {
    id: 'LAYOUT',
    label: 'Layout',
    description: 'Subdivisión espacial del contenedor en subáreas funcionales internas',
    criteria:
      'Elegir LAYOUT cuando el área aglutine múltiples responsabilidades funcionales diferenciadas que requieran su propia partición espacial interna.',
  },
  {
    id: 'VIEW',
    label: 'View',
    description: 'Composición directa de componentes visuales e interactivos terminales',
    criteria:
      'Elegir VIEW cuando el área tenga una responsabilidad funcional acotada y deba materializar directamente sus componentes visuales.',
  },
] as const;

export const ROOT_DECISION_QUESTION: Question = {
  id: 'composition_root_mode',
  type: QuestionType.CHOICE,
  prompt: 'Determina si el contenedor raíz debe articularse mediante un LAYOUT estructural en áreas o como una VIEW unitaria según la especificación y la ruta activa.',
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

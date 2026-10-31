import {
  QuestionType,
  type OptionItem,
  type Question,
} from '@uca/decision/types';
import { SignalType as LayoutSignalType } from '@uca/layout/types';
import { SignalType as ViewSignalType } from '@uca/view/types';
import {
  Role,
  type AreaTarget,
  type Choice,
} from './types.js';

export const __ID__ = 'composition';

export const DEFAULT_PURPOSE =
  'Orquestar recursivamente la arquitectura espacial, visual y funcional de la interfaz, coordinando las decisiones probabilísticas entre partición de áreas (Layout) y materialización de componentes (View)';

export const DEFAULT_INTENTION =
  'Detectar las dimensiones reales del navegador, consultar la especificación integral del sistema (propósito, intención, tono, disposiciones visuales Material Design 3 y capacidades interactivas) y propagar a cada área el contexto, propósito e intención necesarios para articular una experiencia de usuario y funcional coherente de extremo a extremo';

export const DEFAULT_URL = '/';

export const DEFAULT_AREA_ID = 'body';

export const AREA_SEPARATOR = '@';

export const MAXIMUM_DEPTH = 2;

export const BUILD_SIGNALS: Readonly<Record<Choice, string>> = {
  LAYOUT: LayoutSignalType.BUILD,
  VIEW: ViewSignalType.BUILD,
} as const;

export const CHOICE_ROLES: Readonly<Record<Choice, Role>> = {
  LAYOUT: Role.LAYOUT,
  VIEW: Role.VIEW,
} as const;

export const DEFAULT_ROOT_AREA: AreaTarget = {
  id: DEFAULT_AREA_ID,
  qualities: {
    direction: 'column',
    flex: 'fill',
    height: 'screen',
    overflow: 'hidden',
    surface: 'default',
    width: 'full',
  },
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

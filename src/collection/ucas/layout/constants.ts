export const __ID__ = 'layout';

export const DEFAULT_GOAL =
  'Definir en primer lugar el propio contenedor objetivo (con id igual a context.area.id) estableciendo sus qualities de distribución (direction o division, width, height, overflow, surface y gap) acorde a sus dimensiones (context.area.dimensions) y a Material Design 3 (context.design), y a continuación particionar dicho contenedor en sus áreas hijas directas de un solo nivel para cubrir las capacidades funcionales de la especificación (context.specification.interactiveFeatures). Las qualities de las áreas hijas deben ser geométricamente coherentes con la direction o division elegida para el contenedor objetivo, cubriendo el 100% de su espacio sin desbordamiento.';

export const DEFAULT_PURPOSE =
  'Construir estructuras autónomas de partición espacial y jerarquías de áreas de layout';

export const DEFAULT_INTENTION =
  'Configurar la dirección espacial del contenedor actual (context.area.id) y estructurar exclusivamente sus áreas hijas directas mediante una partición de un solo nivel guiada por Material Design 3.';

export const INFER_CONTRACT = {
  goal: DEFAULT_GOAL,
  id: __ID__,
  intention: DEFAULT_INTENTION,
  purpose: DEFAULT_PURPOSE,
} as const;

export const __ID__ = 'layout';

export const DEFAULT_PURPOSE =
  'Construir estructuras autónomas de partición espacial y jerarquías de áreas de layout';

export const DEFAULT_INTENTION =
  'Definir en primer lugar el propio contenedor objetivo (con id igual a context.area.id) estableciendo sus qualities de distribución (direction o division, width, height, overflow, surface y gap) acorde a sus dimensiones (context.area.dimensions) y a Material Design 3 (context.design), y a continuación particionar dicho contenedor en sus áreas hijas directas de un solo nivel para cubrir las capacidades funcionales de la especificación (context.specification.interactiveFeatures). Las áreas hijas deben seguir el eje del contenedor: con direction row son columnas que reparten el ancho (height: full) y con direction column son franjas que reparten el alto (width: full). Exactamente un área hija absorbe el espacio restante con flex: fill y las demás mantienen dimensiones acotadas con flex: none, cubriendo el 100% del espacio sin desbordamiento.';

export const INFER_CONTRACT = {
  id: __ID__,
  intention: DEFAULT_INTENTION,
  purpose: DEFAULT_PURPOSE,
} as const;

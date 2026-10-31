export const __ID__ = 'layout';

export const DEFAULT_IMAGINATION = 0.8;

export const DEFAULT_PURPOSE =
  'Construir estructuras autónomas de partición espacial y jerarquías de áreas funcionales en el contenedor disponible';

export const DEFAULT_INTENTION =
  'Definir en primer lugar el propio contenedor objetivo (con id igual a context.area.id), manteniendo su propósito inmutable (context.area.purpose o context.specification.purpose) y modulando su intention y sus qualities de distribución (direction o division, width, height, flex, overflow, surface y gap) acorde a sus dimensiones (context.area.dimensions) y a Material Design 3 (context.design). A continuación, particionar dicho contenedor en sus áreas hijas directas de un solo nivel resolviendo para cada una: 1) un purpose inmutable acotado y directo (una frase breve de 4 a 12 palabras que defina qué es el área); 2) una intention que exprese cómo debe exponerse cubriendo tres dimensiones: Expectativa (qué resuelve y aporta al usuario), Intención funcional (qué capacidades de context.specification.interactiveFeatures, controles, datos e indicadores reactivos alberga y coordina sin duplicar áreas hermanas en context.siblingAreas) e Intención visual (superficies tonales Material Design 3, jerarquía espacial, contención y forma); y 3) sus qualities espaciales coherentes con el eje del contenedor (con direction row son columnas con height: full; con direction column son franjas con width: full y height medium, large o content en barras fijas y height: auto con flex: fill en áreas elásticas; narrow, compact y regular son solo anchos), donde exactamente un área hija absorbe el espacio restante con flex: fill y las demás mantienen dimensiones acotadas con flex: none.';

export const DEFAULT_LIMITS: readonly string[] = [
  'Contención estricta en el contenedor padre (100dvh en raíz) sin desbordamiento ni scroll global: el contenedor objetivo debe declarar overflow: hidden',
  'Jerarquía espacial de nivel único por invocación: emitir el contenedor objetivo (id === context.area.id) seguido únicamente de sus áreas hijas directas (entre 2 y 4 áreas) sin solapar responsabilidades con context.siblingAreas',
  'En contenedores con direction: column, las barras fijas usan flex: none con height: medium, large o content (nunca height: full ni screen), y las áreas operativas elásticas usan flex: fill con height: auto',
  'En contenedores con direction: row, los paneles laterales fijos usan flex: none con width: narrow, compact o regular y height: full, y el área operativa principal usa flex: fill con height: full',
  'Cada área debe declarar un purpose inmutable acotado y directo (4 a 12 palabras) y una intention que exprese su Expectativa, Intención funcional e Intención visual en Material Design 3',
] as const;

export const INFER_CONTRACT = {
  purpose: DEFAULT_PURPOSE,
  intention: DEFAULT_INTENTION,
  imagination: DEFAULT_IMAGINATION,
  id: __ID__,
} as const;

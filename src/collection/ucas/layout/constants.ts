export const __ID__ = 'layout';

export const DEFAULT_LIMIT = 4096;

export const DEFAULT_IMAGINATION = 0.2;

export const LAYOUT_GOAL =
    'Infer only the direct child areas of the area being partitioned and their visual dimensions (width, height, direction, distribution, alignment) adapted to the viewport and context; deeper partitions emerge in later iterations';

export const LAYOUT_PURPOSE =
    'Construct autonomous spatial layout area partition structures and hierarchies';

export const LAYOUT_INTENTION =
    'Particionar el espacio del área actual en sus áreas hijas directas, emergentes según propósito y contexto, con contención estricta en el viewport (100dvh); no anticipar nietos ni repetir funciones ya cubiertas por áreas ancestras o hermanas.';

export const ROOT_AREA_ID = 'app';

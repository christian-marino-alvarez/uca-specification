import { DESIGN_TOKENS } from '@uca/capability-css/constants';

export const __ID__ = 'builder';

export const DEFAULT_STATUS = 'idle' as const;

export const ROOT_PARENT = 'app';
export const MAX_SUBDIVISION_DEPTH = 2;
export const STRUCTURAL_DEPTH = 0;
export const CORRELATION_SEPARATOR = '::';
export const SUBDIVISION_QUESTION = 'Does this layout area contain two or more clearly distinct visual roles (for example a header, a content body and a set of actions) that are better expressed as separate child areas? Answer no when the area holds a single element such as one button, one input field or one line of text.';
export const COMPACT_WIDTHS: readonly string[] = ['narrow'];
export const resolveNestedWidth = (width: string, depth: number): string => (depth > 0 && width === 'wide' ? 'full' : width);
export const resolveNestedHeight = (height: string, depth: number): string => (depth > 0 && height === 'full' ? 'auto' : height);
export const LEAF_KINDS: readonly string[] = ['heading', 'text', 'action', 'input', 'media'];
export const isLeafKind = (kind?: string): boolean => Boolean(kind && LEAF_KINDS.includes(kind));
export const isNestedArea = (parentTo?: string, depth: number = 0, kind?: string): boolean => (depth > 0 || isLeafKind(kind) || Boolean(parentTo && parentTo !== ROOT_PARENT && parentTo !== 'canvasRoot' && parentTo !== 'canvas_root'));

export const SKELETON_SURFACE = 'muted' as const;
export const SKELETON_ELEVATION = 'low' as const;
export const SKELETON_RADIUS = 'medium' as const;
export const SKELETON_BORDER = 'outline' as const;

const SHIMMER_GRADIENT = '<defs><linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23e2e8f0" stop-opacity="0.8"/><stop offset="50%" stop-color="%23ffffff" stop-opacity="0.95"/><stop offset="100%" stop-color="%23e2e8f0" stop-opacity="0.8"/><animate attributeName="x1" from="-100%" to="100%" dur="1.8s" repeatCount="indefinite"/><animate attributeName="x2" from="0%" to="200%" dur="1.8s" repeatCount="indefinite"/></linearGradient></defs>';

const SHIMMER_FILL = 'fill="url(%23shimmer)"';

const LINE_SHAPE = { height: 32, elements: `<rect x="0" y="4" width="45%" height="24" rx="6" ${SHIMMER_FILL}/>` };

const SKELETON_ELEMENTS: Readonly<Record<string, { height: number; elements: string }>> = {
    action: { height: 40, elements: `<rect x="40%" y="0" width="60%" height="40" rx="8" ${SHIMMER_FILL}/>` },
    heading: { height: 36, elements: `<rect x="0" y="4" width="28" height="28" rx="14" ${SHIMMER_FILL}/><rect x="40" y="8" width="60%" height="16" rx="4" ${SHIMMER_FILL}/>` },
    input: { height: 56, elements: `<rect x="0" y="0" width="100%" height="56" rx="10" fill="%23f8fafc" stroke="%23e2e8f0" stroke-width="1.5"/><rect x="16" y="20" width="40%" height="16" rx="4" ${SHIMMER_FILL}/>` },
    media: { height: 96, elements: `<rect x="0" y="0" width="100%" height="96" rx="10" ${SHIMMER_FILL}/>` },
    text: LINE_SHAPE,
    container: LINE_SHAPE,
};

export const createDynamicSkeletonSvg = (kind: string = 'text', customHeight?: string | number, width?: string | number): string => {
    const { height: defaultHeight, elements } = SKELETON_ELEMENTS[kind] ?? LINE_SHAPE;
    const height = typeof customHeight === 'number' ? customHeight : defaultHeight;
    const compactElements = `<rect x="0" y="0" width="100%" height="${height}" rx="8" ${SHIMMER_FILL}/>`;
    const shapes = COMPACT_WIDTHS.includes(String(width)) ? compactElements : elements;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${height}">${SHIMMER_GRADIENT}${shapes}</svg>`;
    return `data:image/svg+xml;utf8,${svg}`;
};

export const DEFAULT_SKELETON_IMAGE = createDynamicSkeletonSvg();

const SPACING_ORDER: readonly string[] = ['none', 'small', 'medium', 'large', 'xlarge'];
const SPACING_LIMIT_BY_DEPTH: readonly string[] = ['large', 'medium', 'small'];

export const capSpacing = (spacing: string, depth: number): string => {
    const limit = SPACING_LIMIT_BY_DEPTH[Math.min(depth, SPACING_LIMIT_BY_DEPTH.length - 1)] ?? 'small';
    return SPACING_ORDER.indexOf(spacing) > SPACING_ORDER.indexOf(limit) ? limit : spacing;
};

export const resolveGap = (depth: number): string => (depth > 0 ? 'small' : 'medium');

export const CSS_DIMENSIONS_SUMMARY = 'CSS Dimensions Tokens Map: auto (intrinsic/flexible), full (100% of parent container), wide (80% of parent container), two-thirds (66.6%), half (50%), third (33.3%), quarter (25%), narrow (64px, compact), screen (100vh), content (fit-content).';

export const formatDimension = (value?: string | number): string => {
    if (!value) { return 'auto'; }
    const stringVal = String(value);
    const dimensionsMap = DESIGN_TOKENS.dimensions as Record<string, { $value: string; $description: string } | string>;
    const token = dimensionsMap[stringVal];
    if (typeof token === 'object' && token?.$value) {
        return `${stringVal} (${token.$value} - ${token.$description})`;
    }
    return stringVal;
};

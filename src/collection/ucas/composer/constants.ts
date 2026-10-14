export const __ID__ = 'composer';
export const DEFAULT_PARENT = 'app';
export const ROOT_CONTAINER_ID = 'canvasRoot';
export const DEFAULT_MODEL = 'gemini-3.5-flash-lite';
export const CORRELATION_SEPARATOR = '::';
export const DEFAULT_PROVIDER = 'gemini';
export const DEFAULT_CATALOG = ['Box'] as const;
export const DEFAULT_PURPOSE = 'Decompose application requirements into structural representation areas and hierarchical spatial layout regions for autonomous UCA projection';
export const DEFAULT_CONTEXT = 'Spatial decomposition and layout region scaffolding within viewport physical limits';
export const DEFAULT_REQUEST = 'Architect centered visual representation areas presenting UCA with text input and action button';
export const CSS_TOKENS_SUMMARY = 'Design tokens: Dimensions: auto, full (100%), wide (80%), two-thirds (66%), half (50%), third (33%), narrow (64px, reserved for compact icons/badges), screen (100vh height), content. Surfaces: default (#fff), card (#fff elevated), muted (#f3f4f6), dark (#111827), brand (#2563eb), accent (#f59e0b). Spacing: none, small, medium, large, xlarge. Elevation: none, low, card, medium, modal, high. Direction: row, column. Alignment: start, center, end, between.';
export const MACRO_SCAFFOLD_DIRECTIVE = 'Contract: Establish exactly one centered top-level card container (parentTo: "canvasRoot", kind: "container", height: "auto", direction: "row" when minWidth >= 1024 else "column", width: "two-thirds" when minWidth >= 1024, "wide" when minWidth >= 640, "full" when maxWidth < 640) that preserves the requested interactive elements in its purpose. Generate ONLY this 1 container. Do NOT recreate "canvasRoot", do NOT use height "screen", and do NOT generate child areas in this step.';
export const REPRESENTATION_AREAS_DIRECTIVE = MACRO_SCAFFOLD_DIRECTIVE;
export const KINDS = ['container', 'heading', 'text', 'action', 'input', 'media'] as const;
export const KIND_DIRECTIVE = 'Every area MUST declare "kind": container (only when grouping 2+ distinct child areas), heading (title or brand), text (paragraph, label or suggestion), action (single button or control), input (single text field or form), media (image or video). Atomic elements MUST use leaf kinds, never "container". Top-level areas are always "container".';
export const AXIS_DIRECTIVE = 'Keep widths consistent with the parent layout direction: children of a column parent use width "full"; only children of a row parent share the width (half, third, two-thirds).';
export const RECOMPOSE_QUESTION = 'Should we discard the existing areas and generate a brand new composition from scratch, or can we keep the existing areas and adapt their width and direction?';
export const RECOMPOSE_OPTIONS = {
    no: 'Keep existing areas and adapt their width (full/half) and direction (row/column) to fit the new viewport',
    yes: 'Discard existing areas and generate a completely different structural composition from scratch',
} as const;
export const DIRECTION_OPTIONS = { row: 'Horizontal row flow', column: 'Vertical column stack' } as const;
export const WIDTH_OPTIONS = { full: '100% full width', wide: '80% wide container', half: '50% half width', third: '33% third width' } as const;

export const resolveMediaRange = (
    limits?: { readonly width?: number | string; readonly minWidth?: number; readonly maxWidth?: number; readonly orientation?: string },
    custom?: { readonly minWidth?: number; readonly maxWidth?: number; readonly orientation?: string },
): { minWidth?: number; maxWidth?: number; orientation?: string } => {
    const { width, minWidth, maxWidth, orientation } = limits ?? {};
    if (custom?.minWidth !== undefined || custom?.maxWidth !== undefined) {
        return { ...custom, ...(orientation && !custom.orientation && { orientation }) };
    }
    if (minWidth !== undefined || maxWidth !== undefined) {
        return { ...(minWidth !== undefined && { minWidth }), ...(maxWidth !== undefined && { maxWidth }), ...(orientation && { orientation }) };
    }
    const numericWidth = Number(width) || 1440;
    const range = numericWidth < 640 ? { minWidth: 0, maxWidth: 639 } : (numericWidth < 1024 ? { minWidth: 640, maxWidth: 1023 } : { minWidth: 1024, maxWidth: 4096 });
    return { ...range, ...(orientation && { orientation }) };
};

export const formatMediaKey = (parentTo: string, media: { readonly minWidth?: number; readonly maxWidth?: number; readonly orientation?: string }): string => {
    const { minWidth = 0, maxWidth = 'inf', orientation = 'any' } = media;
    return `${parentTo}:${minWidth}-${maxWidth}:${orientation}`;
};

export const matchesMediaRange = (
    media?: { readonly minWidth?: number; readonly maxWidth?: number; readonly orientation?: string },
    limits?: { readonly width?: number | string; readonly minWidth?: number; readonly maxWidth?: number; readonly orientation?: string },
): boolean => {
    if (!media) { return false; }
    const { width, minWidth: limitMinWidth, orientation: targetOrientation } = limits ?? {};
    const numericWidth = Number(width) || (limitMinWidth ?? 1440);
    const { minWidth = 0, maxWidth = Number.POSITIVE_INFINITY, orientation } = media;
    const orientationMatches = !orientation || !targetOrientation || orientation === targetOrientation;
    return numericWidth >= minWidth && numericWidth <= maxWidth && orientationMatches;
};

export const findMatchingMediaKey = (
    medias: Record<string, { readonly media: { readonly minWidth?: number; readonly maxWidth?: number; readonly orientation?: string } }> = {},
    limits?: { readonly width?: number | string; readonly minWidth?: number; readonly maxWidth?: number; readonly orientation?: string },
): string | undefined => {
    const matched = Object.entries(medias).find(([, entry]) => matchesMediaRange(entry.media, limits));
    return matched?.[0];
};

export const buildJevAdaptationCriteria = (_layout: Record<string, unknown> = {}): Record<string, unknown> => ({
    recompose: { instructions: RECOMPOSE_QUESTION, options: RECOMPOSE_OPTIONS },
});

const isTopContainer = (parentTo?: string, kind?: string): boolean =>
    parentTo === DEFAULT_PARENT || kind === 'container';

const resolveResponsiveDirection = (effectiveWidth: number, currentDirection?: string, parentTo?: string, kind?: string): string | undefined => {
    if (isTopContainer(parentTo, kind)) {
        return effectiveWidth >= 1024 ? 'row' : 'column';
    }
    return effectiveWidth < 640 && currentDirection === 'row' ? 'column' : currentDirection;
};

const resolveResponsiveWidth = (effectiveWidth: number, currentWidth: string, parentTo?: string, kind?: string): string => {
    if (currentWidth === 'narrow') { return currentWidth; }
    if (effectiveWidth < 640) { return 'full'; }
    if (isTopContainer(parentTo, kind)) {
        return effectiveWidth < 1024 ? 'wide' : 'two-thirds';
    }
    if (effectiveWidth < 1024) {
        return kind === 'action' ? 'half' : 'full';
    }
    return kind === 'action' ? 'third' : 'two-thirds';
};

export const adaptSectionMeasures = <TSection extends { kind?: string; parentTo?: string; dimensions: { width: string | number; height: string | number }; style?: Record<string, string | undefined>; media?: Record<string, unknown> }>(
    section: TSection,
    limits?: { readonly width?: number | string; readonly minWidth?: number; readonly maxWidth?: number; readonly orientation?: string },
): TSection => {
    const { dimensions = { width: 'full', height: 'auto' }, style = {}, parentTo, kind } = section;
    const effectiveWidth = Number(limits?.width) || (limits?.minWidth ?? 1440);
    const direction = resolveResponsiveDirection(effectiveWidth, style.direction, parentTo, kind);
    const width = resolveResponsiveWidth(effectiveWidth, String(dimensions.width), parentTo, kind);
    const alignment = isTopContainer(parentTo, kind) ? (style.alignment ?? 'center') : style.alignment;
    return { ...section, dimensions: { ...dimensions, width }, style: { ...style, ...(direction && { direction }), ...(alignment && { alignment }) }, media: resolveMediaRange(limits) };
};

export const adaptLayoutMeasures = <TSection extends { kind?: string; parentTo?: string; dimensions: { width: string | number; height: string | number }; style?: Record<string, string | undefined>; media?: Record<string, unknown> }>(
    layout: Record<string, TSection>,
    limits?: { readonly width?: number | string; readonly minWidth?: number; readonly maxWidth?: number; readonly orientation?: string },
    _rawAnswers?: unknown,
): Record<string, TSection> => {
    const entries = Object.entries(layout).map(([areaId, section]) => [areaId, adaptSectionMeasures(section, limits)]);
    return Object.fromEntries(entries);
};

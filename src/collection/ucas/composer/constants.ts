export const __ID__ = 'composer';
export const DEFAULT_PARENT = 'app';
export const DEFAULT_MODEL = 'gemini-3.5-flash-lite';
export const CORRELATION_SEPARATOR = '::';
export const DEFAULT_PROVIDER = 'gemini';
export const DEFAULT_CATALOG = ['Box'] as const;
export const DEFAULT_PURPOSE = 'Decompose application requirements into structural representation areas and hierarchical spatial layout regions for autonomous UCA projection';
export const DEFAULT_CONTEXT = 'Spatial decomposition and layout region scaffolding within viewport physical limits';
export const DEFAULT_REQUEST = 'Architect centered visual representation areas presenting UCA with text input and action button';
export const CSS_TOKENS_SUMMARY = 'Design tokens: Dimensions: auto, full (100%), wide (80%), two-thirds (66%), half (50%), third (33%), narrow (64px, reserved for compact icons/badges), screen (100vh height), content. Surfaces: default (#fff), card (#fff elevated), muted (#f3f4f6), dark (#111827), brand (#2563eb), accent (#f59e0b). Spacing: none, small, medium, large, xlarge. Elevation: none, low, card, medium, modal, high. Direction: row, column. Alignment: start, center, end, between.';
export const MACRO_SCAFFOLD_DIRECTIVE = 'Contract: Establish canvas root (parentTo: "app", kind: "container", dimensions: { width: "full", height: "screen" }) and exactly one top-level container matching metrics.ratio (parentTo: "canvasRoot", kind: "container"). Generate ONLY these 2 containers. Do NOT generate child areas or leaf controls in this step.';
export const REPRESENTATION_AREAS_DIRECTIVE = MACRO_SCAFFOLD_DIRECTIVE;
export const KINDS = ['container', 'heading', 'text', 'action', 'input', 'media'] as const;
export const KIND_DIRECTIVE = 'Every area MUST declare "kind": container (holds other areas), heading (title or brand), text (paragraph or label), action (button or control), input (text field or form), media (image or video). Top-level areas are always "container".';
export const AXIS_DIRECTIVE = 'Keep widths consistent with the parent layout direction: children of a column parent use width "full"; only children of a row parent share the width (half, third, two-thirds).';


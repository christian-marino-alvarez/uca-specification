import type {
    Shape,
} from './types.js';

export const __ID__ = 'placeholder';
export const DEFAULT_KIND = 'text';
export const VIEWBOX_WIDTH = 640;
export const COMPACT_WIDTHS: readonly string[] = [
    'narrow',
];

export const PALETTES = {
    dark: ':root{--surface:#141c29;--edge:#2a3546;--line:#334155;--accent:#b88761}',
    light: ':root{--surface:#f3f5f8;--edge:#dce2eb;--line:#d1d9e5;--accent:#bf8458}',
} as const;

export const SHAPE_STYLES = '.surface{fill:var(--surface);stroke:var(--edge);stroke-width:1}.line{fill:var(--line)}.accent{fill:var(--accent);opacity:.55}';
export const MOTION_STYLES = '@keyframes breathe{0%,100%{opacity:.45}50%{opacity:.8}}.line{animation:breathe 2.4s ease-in-out infinite}@media(prefers-reduced-motion:reduce){.line{animation:none}}';

export const LINE_SHAPE: Shape = {
    height: 88,
    elements: '<rect class="line" x="0" y="8" width="400" height="12" rx="6"/><rect class="line" x="0" y="36" width="576" height="12" rx="6"/><rect class="line" x="0" y="64" width="304" height="12" rx="6"/>',
};

export const VIEW_SHAPE: Shape = {
    height: 176,
    elements: '<rect class="surface" x="1" y="1" width="638" height="174" rx="20"/><rect class="accent" x="28" y="28" width="32" height="4" rx="2"/><rect class="line" x="28" y="52" width="272" height="16" rx="8"/><rect class="line" x="28" y="84" width="480" height="10" rx="5"/><rect class="line" x="28" y="108" width="360" height="10" rx="5"/><rect class="line" x="28" y="140" width="152" height="8" rx="4"/>',
};

export const SHAPES: Readonly<Record<string, Shape>> = {
    action: {
        height: 48,
        elements: '<rect class="surface" x="1" y="1" width="638" height="46" rx="12"/><rect class="line" x="224" y="18" width="192" height="12" rx="6"/>',
    },
    heading: {
        height: 48,
        elements: '<rect class="line" x="0" y="12" width="352" height="20" rx="10"/>',
    },
    input: {
        height: 60,
        elements: '<rect class="surface" x="1" y="1" width="638" height="58" rx="14"/><rect class="line" x="24" y="24" width="248" height="12" rx="6"/>',
    },
    media: VIEW_SHAPE,
    view: VIEW_SHAPE,
    container: VIEW_SHAPE,
    text: LINE_SHAPE,
};

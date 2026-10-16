import type {
    Shape,
} from './types.js';

export const __ID__ = 'placeholder';
export const DEFAULT_KIND = 'text';
export const COMPACT_WIDTHS: readonly string[] = [
    'narrow',
];
export const SHIMMER_GRADIENT = '<defs><linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23e2e8f0" stop-opacity="0.8"/><stop offset="50%" stop-color="%23ffffff" stop-opacity="0.95"/><stop offset="100%" stop-color="%23e2e8f0" stop-opacity="0.8"/><animate attributeName="x1" from="-100%" to="100%" dur="1.8s" repeatCount="indefinite"/><animate attributeName="x2" from="0%" to="200%" dur="1.8s" repeatCount="indefinite"/></linearGradient></defs>';
export const SHIMMER_FILL = 'fill="url(%23shimmer)"';
export const LINE_SHAPE: Shape = {
    height: 32,
    elements: `<rect x="0" y="4" width="45%" height="24" rx="6" ${SHIMMER_FILL}/>` ,
};
export const SHAPES: Readonly<Record<string, Shape>> = {
    action: {
        height: 40,
        elements: `<rect x="0" y="0" width="100%" height="40" rx="8" ${SHIMMER_FILL}/>` ,
    },
    heading: {
        height: 36,
        elements: `<rect x="0" y="4" width="28" height="28" rx="14" ${SHIMMER_FILL}/><rect x="40" y="8" width="60%" height="16" rx="4" ${SHIMMER_FILL}/>` ,
    },
    input: {
        height: 56,
        elements: `<rect x="0" y="0" width="100%" height="56" rx="10" fill="%23f8fafc" stroke="%23e2e8f0" stroke-width="1.5"/><rect x="16" y="20" width="40%" height="16" rx="4" ${SHIMMER_FILL}/>` ,
    },
    media: {
        height: 96,
        elements: `<rect x="0" y="0" width="100%" height="96" rx="10" ${SHIMMER_FILL}/>` ,
    },
    text: LINE_SHAPE,
    container: LINE_SHAPE,
};

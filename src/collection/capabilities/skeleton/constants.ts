export const __ID__ = 'skeleton';

export const DEFAULT_CLASS = 'uca-skeleton';

export const STYLE_TAG_ID = 'uca-skeleton-styles';

export const SKELETON_CSS = `
@keyframes uca-skeleton-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}
.uca-skeleton {
    width: 100%;
    min-height: 48px;
    border-radius: 8px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.03) 25%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.03) 75%);
    background-size: 200% 100%;
    animation: uca-skeleton-shimmer 1.8s infinite ease-in-out;
    pointer-events: none;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.04);
}
`;

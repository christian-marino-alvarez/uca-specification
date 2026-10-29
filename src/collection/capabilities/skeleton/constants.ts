export const __ID__ = 'skeleton';

export const AIM =
  'Renderizar y gestionar marcadores visuales de carga (skeleton) en contenedores del DOM durante la construcción asíncrona de áreas';

export const DEFAULT_CLASS = 'uca-skeleton';

export const STYLE_TAG_ID = 'uca-skeleton-styles';

export const DEFAULT_STYLES = `
@keyframes uca-skeleton-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}
.uca-skeleton {
    width: 100%;
    min-height: 48px;
    flex: 1 1 auto;
    border-radius: var(--md-sys-shape-corner-medium, 12px);
    background: linear-gradient(
        90deg,
        var(--md-sys-color-surface-container, rgba(140, 149, 159, 0.12)) 25%,
        var(--md-sys-color-surface-container-high, rgba(140, 149, 159, 0.24)) 50%,
        var(--md-sys-color-surface-container, rgba(140, 149, 159, 0.12)) 75%
    );
    background-size: 200% 100%;
    animation: uca-skeleton-shimmer 1.5s infinite ease-in-out;
    pointer-events: none;
    box-sizing: border-box;
    border: 1px solid var(--md-sys-color-outline-variant, rgba(140, 149, 159, 0.18));
}
`;

export const __ID__ = 'skeleton';

export const AIM =
  'Renderizar y gestionar marcadores visuales de carga (skeleton) en contenedores del DOM durante la construcción asíncrona de áreas';

export const DEFAULT_CLASS = 'uca-skeleton';

export const STYLE_TAG_ID = 'uca-skeleton-styles';

export const DEFAULT_TEMPLATE = `
<div class="uca-skeleton-box uca-skeleton-header"></div>
<div class="uca-skeleton-grid">
  <div class="uca-skeleton-box uca-skeleton-card"></div>
  <div class="uca-skeleton-box uca-skeleton-card"></div>
  <div class="uca-skeleton-box uca-skeleton-card"></div>
</div>
<div class="uca-skeleton-box uca-skeleton-panel"></div>
`;

export const DEFAULT_STYLES = `
@keyframes uca-skeleton-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
@keyframes uca-skeleton-enter {
    from { opacity: 0; transform: scale(0.995); }
    to { opacity: 1; transform: scale(1); }
}
.uca-skeleton {
    container-type: inline-size;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: clamp(8px, 2.5%, 16px);
    padding: clamp(6px, 2.5%, 16px);
    width: calc(100% - 16px);
    height: calc(100% - 16px);
    margin: 8px;
    min-height: 48px;
    flex: 1 1 auto;
    border-radius: var(--uca-shape-large, 16px);
    background-color: rgba(15, 21, 35, 0.75);
    border: 1px solid rgba(148, 163, 184, 0.14);
    box-shadow:
        0 4px 20px -2px rgba(0, 0, 0, 0.35),
        inset 0 1px 0 0 rgba(255, 255, 255, 0.06);
    pointer-events: none;
    box-sizing: border-box;
    animation: uca-skeleton-enter 200ms cubic-bezier(0.2, 0, 0, 1) both;
}
.uca-skeleton-box {
    border-radius: var(--uca-shape-medium, 12px);
    background: linear-gradient(
        110deg,
        #151c2c 25%,
        #222d44 42%,
        #2f3e5c 50%,
        #222d44 58%,
        #151c2c 75%
    );
    background-size: 250% 100%;
    border: 1px solid rgba(148, 163, 184, 0.16);
    box-shadow:
        0 4px 16px -2px rgba(0, 0, 0, 0.28),
        inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
    animation: uca-skeleton-shimmer 2.2s ease-in-out infinite;
}
.uca-skeleton-header {
    width: 100%;
    height: 56px;
    flex-shrink: 0;
}
.uca-skeleton-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(8px, 2.5%, 16px);
    flex: 1 1 0%;
    min-height: 80px;
}
.uca-skeleton-card {
    width: 100%;
    height: 100%;
    min-height: 64px;
}
.uca-skeleton-panel {
    width: 100%;
    flex: 1.4 1 0%;
    min-height: 96px;
}
@container (max-width: 120px) {
    .uca-skeleton-box {
        border-radius: 10px;
    }
    .uca-skeleton-header {
        height: 36px;
    }
    .uca-skeleton-grid {
        grid-template-columns: minmax(0, 1fr);
        gap: 8px;
        flex: 0 0 auto;
    }
    .uca-skeleton-card {
        height: 36px;
        min-height: 36px;
    }
    .uca-skeleton-panel {
        flex: 1 1 0%;
        min-height: 48px;
    }
}
@container (min-width: 121px) and (max-width: 380px) {
    .uca-skeleton-header {
        height: 44px;
    }
    .uca-skeleton-grid {
        grid-template-columns: minmax(0, 1fr);
        gap: 12px;
    }
    .uca-skeleton-card {
        min-height: 48px;
    }
    .uca-skeleton-panel {
        flex: 1 1 0%;
    }
}
@container (min-width: 381px) and (max-width: 640px) {
    .uca-skeleton-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .uca-skeleton-card:nth-child(3) {
        display: none;
    }
}
`;

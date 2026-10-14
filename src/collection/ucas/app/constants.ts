export const __ID__ = 'app';
export const DEFAULT_ROOT_AREA = 'canvasRoot';
export const DEFAULT_NAME = 'App';
export const DEFAULT_CONTEXT = 'Web browser environment initialized with dynamic viewport and navigator language detection';
export const DEFAULT_LANGUAGE = 'es-ES';

export const resolveViewportMedia = (dimensions?: { readonly width?: number; readonly orientation?: string }): { minWidth: number; maxWidth: number; orientation?: string } => {
    const { width, orientation } = dimensions ?? {};
    const numericWidth = Number(width) || 1440;
    const range = numericWidth < 640 ? { minWidth: 0, maxWidth: 639 } : (numericWidth < 1024 ? { minWidth: 640, maxWidth: 1023 } : { minWidth: 1024, maxWidth: 4096 });
    return { ...range, ...(orientation && { orientation }) };
};

export const resolveRootLayout = (dimensions?: { readonly width?: number }): readonly [string, string] => {
    const numericWidth = Number(dimensions?.width) || 1440;
    if (numericWidth < 640) { return ['full', 'column'] as const; }
    return numericWidth < 1024 ? (['wide', 'column'] as const) : (['two-thirds', 'row'] as const);
};

export const __ID__ = 'memory';

export const DEFAULT_NAMESPACE = 'uca';

export const DEFAULT_PURPOSE = 'Persist, retrieve, and reconcile cognitive dispositions and domain state across storage capabilities';

export const createFallbackStorage = (): Storage => {
    const store = new Map<string, string>();
    return {
        get length(): number { return store.size; },
        clear: (): void => { store.clear(); },
        getItem: (key: string): string | null => store.get(key) ?? null,
        key: (index: number): string | null => Array.from(store.keys())[index] ?? null,
        removeItem: (key: string): void => { store.delete(key); },
        setItem: (key: string, value: string): void => { store.set(key, String(value)); },
    };
};

export const FALLBACK_STORAGE: Storage = createFallbackStorage();

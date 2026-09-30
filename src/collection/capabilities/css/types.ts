export enum SignalType {
    CREATE = 'css.create',
    UPDATE = 'css.update',
    REMOVE = 'css.remove',
    CREATED = 'css.created',
    UPDATED = 'css.updated',
    REMOVED = 'css.removed',
    ERROR = 'css.error',
}

export interface CssRule {
    readonly selector: string;
    readonly declarations: Record<string, string>;
}

export interface SheetAdapter {
    insertRule(ruleText: string, index?: number): number;
    deleteRule(index: number): void;
    readonly cssRules: { length: number; [index: number]: { cssText: string; selectorText?: string } };
}

export interface Body {
    readonly initialRules?: readonly CssRule[];
    readonly sheetAdapter?: SheetAdapter;
}

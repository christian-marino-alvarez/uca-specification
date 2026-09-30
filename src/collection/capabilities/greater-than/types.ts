export enum SignalType {
    EVALUATE = 'greater-than.evaluate',
    EVALUATED = 'greater-than.evaluated',
}

export type Operands = readonly [number, number];

export interface Body {
    readonly operands?: Operands;
}

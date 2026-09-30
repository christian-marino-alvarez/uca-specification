export enum SignalType {
    EVALUATE = 'less-than.evaluate',
    EVALUATED = 'less-than.evaluated',
}

export type Operands = readonly [number, number];

export interface Body {
    readonly operands?: Operands;
}

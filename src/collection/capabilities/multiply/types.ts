export enum SignalType {
    EVALUATE = 'multiply.evaluate',
    EVALUATED = 'multiply.evaluated',
}

export type Operands = readonly [number, number];

export interface Body {
    readonly operands?: Operands;
}

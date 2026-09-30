export enum SignalType {
    EVALUATE = 'divide.evaluate',
    EVALUATED = 'divide.evaluated',
}

export type Operands = readonly [number, number];

export interface Outcome {
    readonly result: number;
    readonly rest: number;
}

export interface Body {
    readonly operands?: Operands;
}

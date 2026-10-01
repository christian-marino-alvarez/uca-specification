export enum SignalType {
    EVALUATE = 'divide.evaluate',
    EVALUATED = 'divide.evaluated',
}

export enum DataType {
    OPERANDS = 'Operands',
    OUTCOME = 'Outcome',
}

export type Operands = readonly [number, number];

export interface Outcome {
    readonly result: number;
    readonly rest: number;
}

export interface Body {
    readonly operands?: Operands;
}

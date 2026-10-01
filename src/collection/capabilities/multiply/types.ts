export enum SignalType {
    EVALUATE = 'multiply.evaluate',
    EVALUATED = 'multiply.evaluated',
}

export enum DataType {
    OPERANDS = 'Operands',
    NUMBER = 'number',
}

export type Operands = readonly [number, number];

export interface Body {
    readonly operands?: Operands;
}

export enum SignalType {
    EVALUATE = 'greater-than.evaluate',
    EVALUATED = 'greater-than.evaluated',
}

export enum DataType {
    OPERANDS = 'Operands',
    BOOLEAN = 'boolean',
}

export type Operands = readonly [number, number];

export interface Body {
    readonly operands?: Operands;
}

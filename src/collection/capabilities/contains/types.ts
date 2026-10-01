export enum SignalType {
    EVALUATE = 'contains.evaluate',
    EVALUATED = 'contains.evaluated',
}

export enum DataType {
    OPERANDS = 'Operands',
    BOOLEAN = 'boolean',
}

export type Operands = readonly [unknown, unknown];

export interface Body {
    readonly operands?: Operands;
}

import { Quantity } from '../index.js';
import { SignalType } from '../types.js';
import { verifyPrimitive } from '../../../../../tests/shared/primitive.js';

verifyPrimitive({
    create: () => new Quantity(),
    disposition: Quantity.disposition,
    signals: SignalType,
    body: {
        label: "Length",
        value: 2,
        unit: "m",
    },
    patch: {
        value: 4,
    },
    tag: 'input',
    updatedTag: 'input',
});

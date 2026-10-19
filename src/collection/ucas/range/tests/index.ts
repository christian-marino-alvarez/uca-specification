import { Range } from '../index.js';
import { SignalType } from '../types.js';
import { verifyPrimitive } from '../../../../../tests/shared/primitive.js';

verifyPrimitive({
    create: () => new Range(),
    disposition: Range.disposition,
    signals: SignalType,
    body: {
        label: "Position",
        minimum: 0,
        maximum: 10,
        value: 3,
    },
    patch: {
        value: 7,
    },
    tag: 'input',
    updatedTag: 'input',
});

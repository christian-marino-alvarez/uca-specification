import { Choice } from '../index.js';
import { SignalType } from '../types.js';
import { verifyPrimitive } from '../../../../../tests/shared/primitive.js';

verifyPrimitive({
    create: () => new Choice(),
    disposition: Choice.disposition,
    signals: SignalType,
    body: {
        items: [
            {
                value: "a",
                label: "Alpha",
            },
            {
                value: "b",
                label: "Beta",
            },
        ],
        value: "a",
    },
    patch: {
        value: "b",
    },
    tag: 'select',
    updatedTag: 'select',
});

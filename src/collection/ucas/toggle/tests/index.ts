import { Toggle } from '../index.js';
import { SignalType } from '../types.js';
import { verifyPrimitive } from '../../../../../tests/shared/primitive.js';

verifyPrimitive({
    create: () => new Toggle(),
    disposition: Toggle.disposition,
    signals: SignalType,
    body: {
        label: "Enabled",
        value: true,
    },
    patch: {
        value: false,
    },
    tag: 'input',
    updatedTag: 'input',
});

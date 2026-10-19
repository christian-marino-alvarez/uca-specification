import { Separator } from '../index.js';
import { SignalType } from '../types.js';
import { verifyPrimitive } from '../../../../../tests/shared/primitive.js';

verifyPrimitive({
    create: () => new Separator(),
    disposition: Separator.disposition,
    signals: SignalType,
    body: {
        orientation: "horizontal",
    },
    patch: {
        orientation: "vertical",
    },
    tag: 'hr',
    updatedTag: 'hr',
});

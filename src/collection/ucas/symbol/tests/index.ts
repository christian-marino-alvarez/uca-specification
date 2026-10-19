import { Symbol } from '../index.js';
import { SignalType } from '../types.js';
import { verifyPrimitive } from '../../../../../tests/shared/primitive.js';

verifyPrimitive({
    create: () => new Symbol(),
    disposition: Symbol.disposition,
    signals: SignalType,
    body: {
        text: "★",
        description: "Favorite",
    },
    patch: {
        description: "Star",
    },
    tag: 'span',
    updatedTag: 'span',
});

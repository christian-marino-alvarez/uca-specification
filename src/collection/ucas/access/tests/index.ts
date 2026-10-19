import { Access } from '../index.js';
import { SignalType } from '../types.js';
import { verifyPrimitive } from '../../../../../tests/shared/primitive.js';

verifyPrimitive({
    create: () => new Access(),
    disposition: Access.disposition,
    signals: SignalType,
    body: {
        text: "Open resource",
        destination: "#app",
    },
    patch: {
        destination: "#next",
    },
    tag: 'a',
    updatedTag: 'a',
});

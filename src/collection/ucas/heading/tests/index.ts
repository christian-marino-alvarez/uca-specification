import { Heading } from '../index.js';
import { SignalType } from '../types.js';
import { verifyPrimitive } from '../../../../../tests/shared/primitive.js';

verifyPrimitive({
    create: () => new Heading(),
    disposition: Heading.disposition,
    signals: SignalType,
    body: {
        text: "A heading",
        importance: 2,
    },
    patch: {
        text: "Updated heading",
        importance: 3,
    },
    tag: 'h2',
    updatedTag: 'h3',
});

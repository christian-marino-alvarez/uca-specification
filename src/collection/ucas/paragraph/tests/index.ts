import { Paragraph } from '../index.js';
import { SignalType } from '../types.js';
import { verifyPrimitive } from '../../../../../tests/shared/primitive.js';

verifyPrimitive({
    create: () => new Paragraph(),
    disposition: Paragraph.disposition,
    signals: SignalType,
    body: {
        text: "A <literal> paragraph",
    },
    patch: {
        text: "Updated paragraph",
    },
    tag: 'p',
    updatedTag: 'p',
});

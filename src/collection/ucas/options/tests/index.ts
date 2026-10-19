import { Options } from '../index.js';
import { SignalType } from '../types.js';
import { verifyPrimitive } from '../../../../../tests/shared/primitive.js';

verifyPrimitive({
    create: () => new Options(),
    disposition: Options.disposition,
    signals: SignalType,
    body: {
        items: [
            {
                value: 'a',
                label: 'Alpha',
            },
            {
                value: 'b',
                label: 'Beta',
            },
        ],
        value: 'a',
    },
    patch: {
        value: 'b',
    },
    tag: 'select',
});

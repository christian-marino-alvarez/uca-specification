import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { z } from 'zod';
import { bodySchema } from '../schema.js';

test('Box preserves the shared visual qualities in its validated body and published catalog', () => {
    const expected = {
        textColor: 'dark', fontWeight: 'semibold', lineHeight: 'normal', textAlign: 'start',
        maxWidth: '48rem', minWidth: '0', minHeight: 'auto', spacingInline: 'medium', spacingBlock: 'small',
        marginInline: 'auto', wrap: 'wrap', distribution: 'between',
    };
    const { qualities } = bodySchema.parse({ qualities: expected });
    assert.deepEqual(qualities, expected);
    assert.match(JSON.stringify(z.toJSONSchema(bodySchema)), /Foreground text color independent of the background/);
});

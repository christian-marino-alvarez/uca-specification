import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { z } from 'zod';
import { qualitiesSchema } from '../schema.js';
import { DESIGN_TOKENS } from '../constants.js';

test('Published quality schemas retain semantic descriptions without fallback theme values', () => {
    const serialized = JSON.stringify(z.toJSONSchema(qualitiesSchema));
    assert.ok(serialized.includes('light: Light foreground for dark surfaces'));
    assert.ok(serialized.includes('small: Compact density spacing'));
    assert.ok(!serialized.includes('#ffffff'));
    assert.ok(serialized.includes('never text color')); assert.ok(serialized.includes('does not create gaps'));
    assert.ok(serialized.includes('explicit distribution overrides'));
    assert.strictEqual(DESIGN_TOKENS.fontWeight.semibold.$value, 600);
    assert.strictEqual(DESIGN_TOKENS.lineHeight.relaxed.$value, 1.75);
});

test('New qualities accept semantic tokens and bounded lengths while rejecting unsupported values', () => {
    assert.ok(qualitiesSchema.safeParse({ surface: 'transparent', textColor: 'light', fontWeight: 'bold', lineHeight: 'normal', textAlign: 'end' }).success);
    assert.ok(qualitiesSchema.safeParse({ maxWidth: '48rem', minWidth: '0', minHeight: 'screen', marginInline: 'auto', wrap: 'wrap', distribution: 'between' }).success);
    assert.ok(qualitiesSchema.safeParse({ spacingInline: 'large', spacingBlock: 'small' }).success);
    assert.strictEqual(qualitiesSchema.safeParse({ textColor: '#ffffff' }).success, false);
    assert.strictEqual(qualitiesSchema.safeParse({ fontWeight: 'heavy' }).success, false);
    assert.strictEqual(qualitiesSchema.safeParse({ maxWidth: 'auto' }).success, false);
    assert.strictEqual(qualitiesSchema.safeParse({ marginInline: '-20px' }).success, false);
});

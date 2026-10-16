import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createParser } from '../parser.js';
import { Mode } from '../types.js';
import { collect, textStream } from './support.js';

const source = JSON.stringify({ alpha: { purpose: 'literal } { and escaped " quote \\ slash', nested: [{ key: 'value' }] }, beta: { purpose: 'second' } });
const expected = [{ alpha: { purpose: 'literal } { and escaped " quote \\ slash', nested: [{ key: 'value' }] } }, { beta: { purpose: 'second' } }];

test('entry parsing is independent of every possible network split', async () => {
    for (let boundary = 0; boundary <= source.length; boundary++) {
        const chunks = [source.slice(0, boundary), source.slice(boundary)];
        assert.deepEqual(await collect(textStream(chunks).pipeThrough(createParser(Mode.ENTRIES))), expected);
    }
    assert.deepEqual(await collect(textStream([...source]).pipeThrough(createParser(Mode.ENTRIES))), expected);
});

test('complete document includes all entries and optional split markdown fences', async () => {
    const stream = textStream([...'```json\n', ...source, ...'\n```']);
    assert.deepEqual(await collect(stream.pipeThrough(createParser(Mode.DOCUMENT))), [JSON.parse(source)]);
});

test('incomplete JSON, malformed entries and trailing content reject explicitly', async () => {
    for (const value of ['{"alpha":{', '{"alpha":}', '{"alpha":{},}', '{"alpha":{}}junk', '{"alpha":{},"alpha":{}}', '```json\n{}']) {
        await assert.rejects(collect(textStream([value]).pipeThrough(createParser(Mode.ENTRIES))), SyntaxError);
    }
});

test('document validation cannot see a partial or duplicate document', async () => {
    const chunks = ['{"alpha":{},', '"alpha":{}}'];
    await assert.rejects(collect(textStream(chunks).pipeThrough(createParser(Mode.DOCUMENT))), /duplicate/);
    await assert.rejects(collect(textStream(['{"alpha":{}']).pipeThrough(createParser(Mode.DOCUMENT))), /Incomplete/);
});

test('retained text has an enforced bound', async () => {
    await assert.rejects(collect(textStream(['{"alpha":"', 'too much pending text']).pipeThrough(createParser(Mode.ENTRIES, 20))), /buffer exceeds/);
    await assert.rejects(collect(textStream(['{"a":{},', '"b":{}}']).pipeThrough(createParser(Mode.DOCUMENT, 10))), /buffer exceeds/);
});

test('entry memory limits are independent of text segmentation', async () => {
    const document = Object.fromEntries(Array.from({ length: 20 }, (_, index) => [`entry${index}`, { purpose: 'A useful description of the entry' }]));
    const text = JSON.stringify(document);
    const coalesced = await collect(textStream([text]).pipeThrough(createParser(Mode.ENTRIES, 256)));
    const fragmented = await collect(textStream([...text]).pipeThrough(createParser(Mode.ENTRIES, 256)));
    assert.equal(coalesced.length, 20); assert.deepEqual(coalesced, fragmented);
});

test('parser yields the first entry before parsing the coalesced tail', async () => {
    const reader = textStream(['{"first":{},"broken":}']).pipeThrough(createParser(Mode.ENTRIES)).getReader();
    assert.deepEqual(await reader.read(), { done: false, value: { first: {} } });
    await assert.rejects(reader.read(), SyntaxError);
});

test('document bounds count split surrogate pairs consistently', async () => {
    const value = '{"a":"😀"}';
    const split = value.split('');
    assert.deepEqual(await collect(textStream([value]).pipeThrough(createParser(Mode.DOCUMENT, value.length))), [{ a: '😀' }]);
    assert.deepEqual(await collect(textStream(split).pipeThrough(createParser(Mode.DOCUMENT, value.length))), [{ a: '😀' }]);
    await assert.rejects(collect(textStream([value]).pipeThrough(createParser(Mode.DOCUMENT, value.length - 1))), /buffer exceeds/);
    await assert.rejects(collect(textStream(split).pipeThrough(createParser(Mode.DOCUMENT, value.length - 1))), /buffer exceeds/);
});

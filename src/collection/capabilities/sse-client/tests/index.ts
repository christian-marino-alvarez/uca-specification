import { strict as assert } from 'node:assert';
import { SseClient } from '../index.js';
import { SignalType } from '../types.js';
import { __ID__, AIM, DEFAULT_ENDPOINT } from '../constants.js';

function testSseClientInitialization(): void {
    const client = new SseClient();
    assert.equal(client.id, __ID__);
    assert.equal(SseClient.AIM, AIM);
    const { aim } = SseClient.disposition;
    assert.equal(aim.description, AIM);
    assert.equal(aim.body?.endpoint, DEFAULT_ENDPOINT);
}

function testSseClientAbort(): void {
    const bus = new EventTarget();
    const client = new SseClient();
    client.innervate(bus);
    let aborted = false;
    bus.addEventListener(SignalType.ABORTED, () => {
        aborted = true;
    });
    bus.dispatchEvent(new CustomEvent(SignalType.ABORT, {
        detail: { source: 'test', property: SignalType.ABORT, value: { correlationId: 'test-123' }, timestamp: Date.now() },
    }));
    assert.equal(aborted, true);
}

async function runTests(): Promise<void> {
    testSseClientInitialization();
    testSseClientAbort();
    console.log('✅ SseClient capability tests passed successfully');
}

runTests();

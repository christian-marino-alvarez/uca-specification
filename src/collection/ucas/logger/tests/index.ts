import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { Capability } from '@uca/core/capability';
import { Logger } from '../index.js';
import { SignalType, type LogEntry } from '../types.js';
import { __ID__ } from '../constants.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test-source', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
    bus.dispatchEvent(new CustomEvent('*', { detail: signal }));
}

function testLogger_IdentityAndDefaults(): void {
    const logger = new Logger();
    assert.strictEqual(logger.id, __ID__);
    assert.strictEqual(logger.purpose, Logger.purpose);
    assert.ok(logger instanceof Uca);
    logger.innervate();
    assert.strictEqual(logger.disposition.inputs?.length, 1);
    assert.strictEqual(logger.disposition.outputs?.length, 1);
    logger.denervate();
}

function testLogger_LogsBusSignals(): void {
    const bus = new EventTarget();
    const loggedEntries: LogEntry[] = [];
    const logger = new Logger('test-logger').innervate(bus);
    emitSignal(bus, Capability.updateEvent('test-logger'), {
        aim: {
            description: Logger.purpose,
            body: {
                onLog: (entry: LogEntry) => loggedEntries.push(entry),
            },
        },
        reactTo: ['*'],
    });

    emitSignal(bus, 'custom.signal', { data: 123 });
    const customEntry = loggedEntries.find((entry) => entry.property === 'custom.signal');
    assert.ok(customEntry);
    assert.strictEqual(customEntry?.property, 'custom.signal');
    assert.strictEqual(customEntry?.source, 'test-source');

    logger.denervate();
}

function runAllLoggerTests(): void {
    testLogger_IdentityAndDefaults();
    testLogger_LogsBusSignals();
    console.log('✔ All Logger UCA minimal architecture tests passed successfully.');
}

runAllLoggerTests();

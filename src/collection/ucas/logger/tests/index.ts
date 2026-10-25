import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Capability } from '@uca/core/capability';
import type { Signal } from '@uca/core/types';
import { DispositionSignal as DispositionSignalType } from '@uca/core/types';
import { Logger } from '../index.js';
import { Scope, SignalType, type LogEntry } from '../types.js';

class Emitter extends Capability {
    protected override react(_signal: Signal): void {}
    public emit(property: string, value: unknown, targetId?: string): void { this.pulse(property, value, targetId); }
}

function fixture() {
    const bus = new EventTarget(), entries: LogEntry[] = [], signals: Signal[] = [];
    const emitter = new Emitter('emitter').innervate(bus);
    const logger = new Logger('observer').innervate(bus);
    const body = { onLog: (entry: LogEntry) => entries.push(entry) };
    emitter.emit(logger.updateEvent, { ...Logger.disposition, aim: { description: Logger.purpose, body } });
    entries.length = 0;
    bus.addEventListener(SignalType.LOG, (event) => { const { detail } = event as CustomEvent<Signal>; signals.push(detail); });
    return { bus, emitter, logger, entries, signals };
}

test('Logger observes addressed pulses once through the Core wildcard channel', (context) => {
    context.mock.method(console, 'log', () => {});
    const { emitter, logger, entries, signals } = fixture();
    const value = { areaId: 'root' };
    emitter.emit(DispositionSignalType.GET, value, 'receiver');
    assert.deepEqual(entries.map(({ source, property, value: payload }) => ({ source, property, value: payload })), [{ source: 'emitter', property: DispositionSignalType.GET, value }]);
    assert.equal(signals.length, 1); assert.equal(entries[0].targetId, 'receiver');
    assert.equal(entries[0].timestamp, (signals[0].value as LogEntry).timestamp);
    logger.denervate(); emitter.denervate();
});

test('Logger filters observed pulses and disconnects on denervation', (context) => {
    context.mock.method(console, 'log', () => {});
    const { emitter, logger, entries } = fixture();
    const body = { prefix: 'filtered', filter: ({ property }: Signal) => property === DispositionSignalType.GET, onLog: (entry: LogEntry) => entries.push(entry) };
    emitter.emit(logger.updateEvent, { ...Logger.disposition, aim: { description: Logger.purpose, body } });
    emitter.emit(DispositionSignalType.UPDATE, {}); emitter.emit(DispositionSignalType.GET, {});
    assert.equal(entries.length, 1);
    logger.denervate(); emitter.emit(DispositionSignalType.GET, {});
    assert.equal(entries.length, 1); emitter.denervate();
});

test('Two wildcard loggers ignore log outputs without recursive logging', (context) => {
    context.mock.method(console, 'log', () => {});
    const { bus, emitter, logger, entries, signals } = fixture();
    const other = new Logger('other').innervate(bus);
    emitter.emit(other.updateEvent, Logger.disposition);
    entries.length = 0; signals.length = 0;
    emitter.emit(DispositionSignalType.UPDATE, { id: 'receiver' });
    assert.equal(entries.length, 1); assert.equal(signals.length, 2);
    other.denervate(); logger.denervate(); emitter.denervate();
});

test('Logger exposes structural context without altering the observed payload', (context) => {
    context.mock.method(console, 'log', () => {});
    const { emitter, logger, entries } = fixture();
    const area = { areaId: 'root--input', parentTo: 'root', compositionId: 'composition-1', depth: 1 };
    const payload = { state: area, sessionId: 'request-1' };
    emitter.emit(DispositionSignalType.PROVIDE, payload);
    const { areaId, parentTo, compositionId, depth, sessionId, value } = entries[0];
    assert.deepEqual({ areaId, parentTo, compositionId, depth, sessionId }, { ...area, sessionId: 'request-1' });
    assert.equal(value, payload); logger.denervate(); emitter.denervate();
});

[Scope.FRONT, Scope.BACKEND].forEach((scope) => {
    test(`Logger labels ${scope} records without the redundant bus prefix`, (context) => {
        const output = context.mock.method(console, 'log', () => {});
        const { emitter, logger, entries } = fixture();
        emitter.emit(logger.updateEvent, { ...Logger.disposition, aim: { description: Logger.purpose, body: { scope, onLog: (entry: LogEntry) => entries.push(entry) } } });
        emitter.emit(DispositionSignalType.GET, { areaId: 'root' });
        const { arguments: loggedArguments } = output.mock.calls.at(-1)!;
        assert.equal(loggedArguments[0], `[${scope}] [emitter] -> GET`);
        assert.equal(entries.at(-1)?.scope, scope);
        logger.denervate(); emitter.denervate();
    });
});

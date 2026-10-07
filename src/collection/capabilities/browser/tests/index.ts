import type { Signal } from '@uca/core/types';
import { Browser } from '../index.js';
import { SignalType, type BrowserContext } from '../types.js';

console.log('🧪 Testing Browser capability...');

const target = new EventTarget();
const capability = new Browser('browser:test');

const detectedEvents: BrowserContext[] = [];
let destroyedConfirmation = false;

const countEvents = (): number => detectedEvents.length;

target.addEventListener(SignalType.DETECTED, (event: Event) => {
    const customEvent = event as CustomEvent<Signal>;
    const { property, value } = customEvent.detail;
    if (property === SignalType.DETECTED) {
        detectedEvents.push(value as BrowserContext);
    }
});

target.addEventListener(SignalType.DESTROYED, () => {
    destroyedConfirmation = true;
});

capability.innervate(target);

if (countEvents() !== 0) {
    throw new Error(`Innervation must be purely topological and must not emit detected events, got ${countEvents()}`);
}

target.dispatchEvent(new CustomEvent(SignalType.READ, {
    detail: { source: 'test', property: SignalType.READ, value: undefined, timestamp: Date.now() },
}));

if (countEvents() !== 1) {
    throw new Error(`Expected exactly 1 detected event after READ signal, got ${countEvents()}`);
}

const [initialContext] = detectedEvents;
const { viewport, screen, browser } = initialContext;
if (typeof viewport.width !== 'number' || typeof viewport.height !== 'number') {
    throw new Error('Browser capability must provide valid viewport dimensions');
}

if (typeof screen.width !== 'number' || typeof screen.pixelRatio !== 'number') {
    throw new Error('Browser capability must provide valid screen metrics');
}

if (typeof browser.userAgent !== 'string' || typeof browser.touch !== 'boolean') {
    throw new Error('Browser capability must provide valid browser metrics');
}

target.dispatchEvent(new CustomEvent(SignalType.READ, {
    detail: { source: 'test', property: SignalType.READ, value: undefined, timestamp: Date.now() },
}));

if (countEvents() !== 2) {
    throw new Error(`Expected exactly 2 detected events after second READ signal, got ${countEvents()}`);
}

target.dispatchEvent(new CustomEvent(SignalType.DESTROY, {
    detail: { source: 'test', property: SignalType.DESTROY, value: undefined, timestamp: Date.now() },
}));

if (!destroyedConfirmation) {
    throw new Error('Browser capability must emit DESTROYED confirmation upon DESTROY signal');
}

capability.denervate();

console.log('✔ All Browser capability tests passed successfully.');

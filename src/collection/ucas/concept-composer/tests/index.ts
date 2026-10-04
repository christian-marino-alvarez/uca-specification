import * as assert from 'node:assert';
import { setMaxListeners } from 'node:events';
import { Uca } from '@uca/core/uca';
import { type Signal } from '@uca/core/types';
import { SignalType as LlmWebSignalType, type PromptPayload } from '@uca/llm-web';
import {
    ConceptComposer,
    DataType,
    DEFAULT_CONCEPT_MAP,
    PURPOSE,
    SignalType,
    __ID__,
    buildConceptPrompt,
} from '../index.js';

function createTestBus(): EventTarget {
    const bus = new EventTarget();
    try { setMaxListeners(50, bus); } catch { }
    return bus;
}

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testConceptComposer_IdentityAndDefaults(): void {
    const composer = new ConceptComposer();
    assert.ok(composer instanceof Uca);
    assert.strictEqual(composer.id, __ID__);
    assert.strictEqual(composer.purpose, PURPOSE);
    const { inputs, outputs, aim } = composer.disposition;
    assert.strictEqual(inputs?.length, 4);
    assert.strictEqual(inputs?.[0]?.type, DataType.VOID);
    assert.strictEqual(outputs?.length, 4);
    assert.strictEqual(outputs?.[0]?.type, DataType.CONCEPT_MAP);
    assert.strictEqual(aim.description, PURPOSE);
}

function testConceptComposer_InnervationAndCooky(): void {
    const bus = createTestBus();
    const composer = new ConceptComposer().innervate(bus);
    assert.notStrictEqual(composer.target, undefined);
    assert.notStrictEqual(composer.disposition, undefined);
    composer.denervate();
}

function testConceptComposer_CreatePulsesLlmWebPrompt(): void {
    const bus = createTestBus();
    let capturedPrompt: PromptPayload | undefined;

    bus.addEventListener(LlmWebSignalType.PROMPT, (event: Event) => {
        capturedPrompt = (event as CustomEvent<Signal<PromptPayload>>).detail?.value;
    });

    const composer = new ConceptComposer('concept-test').innervate(bus);
    emitSignal(bus, SignalType.CREATE, { prompt: 'Create luxury coffee shop web' });

    assert.ok(capturedPrompt !== undefined);
    assert.ok(capturedPrompt?.prompt?.includes('luxury coffee shop web'));
    assert.ok(capturedPrompt?.schema !== undefined);
    assert.strictEqual(capturedPrompt?.model, 'gemini-2.5-flash');

    composer.denervate();
}

function testConceptComposer_LlmResponsePulsesCreated(): void {
    const bus = createTestBus();
    let capturedResult: unknown;

    bus.addEventListener(SignalType.CREATED, (event: Event) => {
        capturedResult = (event as CustomEvent<Signal>).detail?.value;
    });

    const composer = new ConceptComposer('concept-res-test').innervate(bus);
    const sampleResponse = JSON.stringify({
        theme: {
            name: 'Artisan Roast',
            essence: 'Sensory journey into artisanal specialty coffee',
            mood: 'Warm, refined, mindful',
            aesthetic: 'Earth tones, subtle warmth and rich textures',
        },
        capabilities: [
            { name: 'SensoryOriginHero', purpose: 'Immerse in roast origins', interaction: 'Atmospheric visual storytelling' },
            { name: 'FlavorProfileSelector', purpose: 'Guide coffee selection', interaction: 'Interactive taste wheel' },
        ],
        zones: [
            { name: 'OriginImmersion', purpose: 'Engage senses', capabilities: ['SensoryOriginHero'] },
            { name: 'TastingDeck', purpose: 'Explore coffee notes', capabilities: ['FlavorProfileSelector'] },
        ],
    });

    emitSignal(bus, LlmWebSignalType.RESPONSE, { response: sampleResponse });

    assert.ok(capturedResult !== undefined);
    const { concept } = (capturedResult ?? {}) as { concept?: typeof DEFAULT_CONCEPT_MAP };
    assert.strictEqual(concept?.theme?.name, 'Artisan Roast');
    assert.strictEqual(concept?.capabilities?.length, 2);
    assert.strictEqual(concept?.zones?.length, 2);

    composer.denervate();
}

function testConceptComposer_LlmErrorAppliesFallback(): void {
    const bus = createTestBus();
    let capturedResult: unknown;

    bus.addEventListener(SignalType.CREATED, (event: Event) => {
        capturedResult = (event as CustomEvent<Signal>).detail?.value;
    });

    const composer = new ConceptComposer('concept-err-test').innervate(bus);
    emitSignal(bus, LlmWebSignalType.ERROR, new Error('LLM timeout'));

    assert.ok(capturedResult !== undefined);
    const { concept } = (capturedResult ?? {}) as { concept?: typeof DEFAULT_CONCEPT_MAP };
    assert.strictEqual(concept?.theme?.name, DEFAULT_CONCEPT_MAP.theme.name);

    composer.denervate();
}

function testConceptComposer_PromptBuilderFormatting(): void {
    const prompt = buildConceptPrompt('SaaS analytics dashboard');
    assert.ok(prompt.includes('SaaS analytics dashboard'));
    assert.ok(prompt.includes('Do NOT generate HTML, CSS, or component names'));
    assert.ok(!prompt.includes('<div>'));
}

async function run(): Promise<void> {
    console.log('🧪 Testing ConceptComposer UCA...');
    testConceptComposer_IdentityAndDefaults();
    testConceptComposer_InnervationAndCooky();
    testConceptComposer_CreatePulsesLlmWebPrompt();
    testConceptComposer_LlmResponsePulsesCreated();
    testConceptComposer_LlmErrorAppliesFallback();
    testConceptComposer_PromptBuilderFormatting();
    console.log('✅ ConceptComposer tests passed successfully!');
}

run().catch((error) => {
    console.error('❌ ConceptComposer tests failed:', error);
    process.exit(1);
});

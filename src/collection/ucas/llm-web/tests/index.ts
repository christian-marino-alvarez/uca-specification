import assert from 'node:assert/strict';
import type { Signal } from '@uca/core/types';
import { LlmWeb, SignalType, type ResponsePayload, type StreamDecodedPayload } from '../index.js';

async function testLlmWebUca(): Promise<void> {
    const llmWeb = new LlmWeb('test-llm-web');
    assert.equal(llmWeb.id, 'test-llm-web');
    assert.equal(llmWeb.purpose, 'Orchestrate client-side LLM interactions and streaming cognitive sessions');

    let responseReceived = false;
    let decodedStreamReceived = false;
    const receivedTokens: string[] = [];

    // Mock global fetch for testing
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const urlStr = String(input);
        if (urlStr.includes('/api/llm/sse')) {
            const encoder = new TextEncoder();
            const stream = new ReadableStream({
                start(controller) {
                    controller.enqueue(encoder.encode('data: {"text":"token1"}\n\n'));
                    controller.enqueue(encoder.encode('data: {"text":"token2"}\n\n'));
                    controller.enqueue(encoder.encode('data: {"done":true}\n\n'));
                    controller.close();
                },
            });
            return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });
        }
        return new Response(JSON.stringify({ response: 'Test answer', model: 'mock-model' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    };

    llmWeb.target?.addEventListener(SignalType.RESPONSE, (event: Event) => {
        const customEvent = event as CustomEvent<Signal>;
        const { value } = customEvent.detail;
        const payload = value as ResponsePayload;
        const { response } = payload;
        assert.equal(response, 'Test answer');
        responseReceived = true;
    });

    llmWeb.target?.addEventListener(SignalType.STREAM_DECODED, async (event: Event) => {
        const customEvent = event as CustomEvent<Signal<StreamDecodedPayload>>;
        const { value } = customEvent.detail;
        const { stream } = value;
        decodedStreamReceived = true;
        const reader = stream.getReader();
        while (true) {
            const { done, value: chunk } = await reader.read();
            if (done) { break; }
            if (chunk) { receivedTokens.push(chunk); }
        }
    });

    llmWeb.innervate();

    // Trigger PROMPT signal
    llmWeb.target?.dispatchEvent(new CustomEvent(SignalType.PROMPT, {
        detail: {
            source: 'test-client',
            property: SignalType.PROMPT,
            value: { prompt: 'Hello', useRemote: true },
            timestamp: Date.now(),
        },
    }));

    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.equal(responseReceived, true, 'Should receive RESPONSE signal');

    // Trigger STREAM signal
    llmWeb.target?.dispatchEvent(new CustomEvent(SignalType.STREAM, {
        detail: {
            source: 'test-client',
            property: SignalType.STREAM,
            value: { prompt: 'Stream test', streamId: 'stream-alpha', useRemote: true },
            timestamp: Date.now(),
        },
    }));

    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.equal(decodedStreamReceived, true, 'Should receive STREAM_DECODED signal');
    assert.deepEqual(receivedTokens, ['token1', 'token2']);

    // Restore original fetch
    globalThis.fetch = originalFetch;
    llmWeb.denervate();
}

async function testLlmWeb_PromptApi_PureLocal(): Promise<void> {
    const factory = {
        availability: async () => 'readily' as const,
        create: async () => ({
            promptStreaming: () => new ReadableStream<string>({
                start(controller) { controller.enqueue('token-nano'); controller.close(); },
            }),
            prompt: async () => 'response-nano',
            destroy: () => {},
        }),
    };
    const llmWeb = new LlmWeb('local-llm-web');
    let receivedToken = '';
    llmWeb.target?.addEventListener(SignalType.STREAM_DECODED, async (event: Event) => {
        const customEvent = event as CustomEvent<Signal<StreamDecodedPayload>>;
        const reader = customEvent.detail.value.stream.getReader();
        const { value } = await reader.read();
        receivedToken = value ?? '';
    });
    llmWeb.innervate(undefined, { aim: { description: 'test', body: { factory } } });
    llmWeb.target?.dispatchEvent(new CustomEvent(SignalType.STREAM, {
        detail: { source: 'test', property: SignalType.STREAM, value: { prompt: 'hi' }, timestamp: Date.now() },
    }));
    await new Promise((resolve) => setTimeout(resolve, 60));
    assert.equal(receivedToken, 'token-nano');
    llmWeb.denervate();
}

async function runAllLlmWebTests(): Promise<void> {
    await testLlmWebUca();
    await testLlmWeb_PromptApi_PureLocal();
    console.log('✔ All LlmWeb UCA tests passed successfully.');
}

runAllLlmWebTests();

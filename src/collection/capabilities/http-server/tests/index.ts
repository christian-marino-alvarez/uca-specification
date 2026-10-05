import assert from 'node:assert/strict';
import type { Signal } from '@uca/core/types';
import { HttpServer } from '../index.js';
import { SignalType, type RequestContext, type ListeningStatus } from '../types.js';

async function testHttpServerCapability(): Promise<void> {
    const target = new EventTarget();
    const server = new HttpServer('test-http-server');
    let listeningReceived = false;
    const receivedRequests: RequestContext[] = [];
    let activeUrl = '';

    target.addEventListener(SignalType.LISTENING, (event: Event) => {
        const customEvent = event as CustomEvent<Signal>;
        const { value } = customEvent.detail;
        listeningReceived = true;
        const status = value as ListeningStatus;
        const { url } = status;
        activeUrl = url;
    });

    target.addEventListener(SignalType.REQUEST, (event: Event) => {
        const customEvent = event as CustomEvent<Signal>;
        const { value } = customEvent.detail;
        receivedRequests.push(value as RequestContext);
    });

    server.innervate(target, {
        aim: {
            description: HttpServer.AIM,
            body: {
                port: 39123,
                hostname: '127.0.0.1',
                routes: [
                    {
                        method: 'GET',
                        path: '/health',
                        response: { status: 200, body: { status: 'healthy' } },
                    },
                    {
                        method: 'POST',
                        path: '/echo',
                        handler: (context: RequestContext) => ({
                            status: 201,
                            body: { received: context.body },
                        }),
                    },
                ],
            },
        },
        reactTo: [SignalType.LISTEN, SignalType.CLOSE, SignalType.ROUTE, SignalType.RESPOND],
    });

    target.dispatchEvent(new CustomEvent(SignalType.LISTEN, {
        detail: {
            source: 'test',
            property: SignalType.LISTEN,
            value: { port: 39123, hostname: '127.0.0.1' },
            timestamp: Date.now(),
        },
    }));

    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.equal(listeningReceived, true, 'Server should emit LISTENING signal');

    // Test GET /health
    const healthResponse = await fetch(`${activeUrl}/health`);
    assert.equal(healthResponse.status, 200);
    const healthData = await healthResponse.json() as { status: string };
    const { status } = healthData;
    assert.equal(status, 'healthy');

    // Test POST /echo
    const echoResponse = await fetch(`${activeUrl}/echo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'hello uca' }),
    });
    assert.equal(echoResponse.status, 201);
    const echoData = await echoResponse.json() as { received: { message: string } };
    const { received } = echoData;
    const { message } = received;
    assert.equal(message, 'hello uca');

    assert.equal(receivedRequests.length, 2, 'Should receive 2 requests');
    const [firstRequest, secondRequest] = receivedRequests;
    assert.equal(firstRequest.method, 'GET');
    assert.equal(secondRequest.method, 'POST');

    // Clean up
    server.denervate();
    console.log('✔ All HttpServer capability tests passed successfully.');
}

testHttpServerCapability();

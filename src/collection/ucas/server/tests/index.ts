import assert from 'node:assert/strict';
import type { Signal } from '@uca/core/types';
import {
    Server,
    SignalType,
    type RequestContext,
    type StartedStatus,
} from '../index.js';

async function testServerUca(): Promise<void> {
    const server = new Server('api-server');
    assert.equal(server.id, 'api-server');
    assert.equal(server.purpose, Server.purpose);

    let startedReceived = false;
    let stoppedReceived = false;
    let requestCount = 0;
    let activeUrl = '';

    server.target?.addEventListener(SignalType.STARTED, (event: Event) => {
        const customEvent = event as CustomEvent<Signal>;
        const { value } = customEvent.detail;
        startedReceived = true;
        const status = value as StartedStatus;
        const { url } = status;
        activeUrl = url;
    });

    server.target?.addEventListener(SignalType.STOPPED, () => {
        stoppedReceived = true;
    });

    server.target?.addEventListener(SignalType.REQUEST, (event: Event) => {
        const customEvent = event as CustomEvent<Signal>;
        const { value } = customEvent.detail;
        const requestContext = value as RequestContext;
        const { path } = requestContext;
        if (path === '/api/ping' || path === '/api/users') {
            requestCount += 1;
        }
    });

    server.innervate(undefined, {
        aim: {
            description: Server.purpose,
            body: {
                port: 39124,
                hostname: '127.0.0.1',
                routes: [
                    {
                        method: 'GET',
                        path: '/api/ping',
                        response: { status: 200, body: { message: 'pong' } },
                    },
                    {
                        method: 'POST',
                        path: '/api/users',
                        handler: (context: RequestContext) => ({
                            status: 201,
                            body: { user: context.body },
                        }),
                    },
                ],
            },
        },
        reactTo: [...Server.disposition.reactTo ?? []],
    });

    // Start server via domain signal
    server.target?.dispatchEvent(new CustomEvent(SignalType.START, {
        detail: {
            source: 'test-client',
            property: SignalType.START,
            value: { port: 39124, hostname: '127.0.0.1' },
            timestamp: Date.now(),
        },
    }));

    await new Promise((resolve) => setTimeout(resolve, 150));
    assert.equal(startedReceived, true, 'Server should emit STARTED signal');

    // Test GET /api/ping
    const pingResponse = await fetch(`${activeUrl}/api/ping`);
    assert.equal(pingResponse.status, 200);
    const pingData = await pingResponse.json() as { message: string };
    const { message } = pingData;
    assert.equal(message, 'pong');

    // Test POST /api/users
    const userResponse = await fetch(`${activeUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Ada Lovelace' }),
    });
    assert.equal(userResponse.status, 201);
    const userData = await userResponse.json() as { user: { name: string } };
    const { user } = userData;
    const { name } = user;
    assert.equal(name, 'Ada Lovelace');

    // Test dynamic route addition via ROUTE signal
    server.target?.dispatchEvent(new CustomEvent(SignalType.ROUTE, {
        detail: {
            source: 'test-client',
            property: SignalType.ROUTE,
            value: {
                method: 'GET',
                path: '/api/dynamic',
                response: { status: 200, body: { dynamic: true } },
            },
            timestamp: Date.now(),
        },
    }));

    await new Promise((resolve) => setTimeout(resolve, 50));
    const dynamicResponse = await fetch(`${activeUrl}/api/dynamic`);
    assert.equal(dynamicResponse.status, 200);
    const dynamicData = await dynamicResponse.json() as { dynamic: boolean };
    const { dynamic } = dynamicData;
    assert.equal(dynamic, true);

    // Stop server via STOP signal
    server.target?.dispatchEvent(new CustomEvent(SignalType.STOP, {
        detail: {
            source: 'test-client',
            property: SignalType.STOP,
            value: undefined,
            timestamp: Date.now(),
        },
    }));

    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.equal(stoppedReceived, true, 'Server should emit STOPPED signal');

    // Clean up
    server.denervate();
    console.log('✔ All Server UCA tests passed successfully.');
}

testServerUca();

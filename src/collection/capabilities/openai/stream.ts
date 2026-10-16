import type { StreamIterator } from './types.js';

export function createStream(iterator: StreamIterator, abort: AbortController, cleanup: () => void): ReadableStream<string> {
    return new ReadableStream<string>({
        pull: (controller) => readNext(iterator, controller, abort, cleanup),
        async cancel(reason) {
            abort.abort(reason); cleanup();
            await iterator.return?.();
        },
    }, { highWaterMark: 0 });
}

async function readNext(iterator: StreamIterator, controller: ReadableStreamDefaultController<string>, abort: AbortController, cleanup: () => void): Promise<void> {
    try {
        const { signal } = abort; signal.throwIfAborted();
        const { done, value } = await iterator.next();
        if (done) {
            cleanup(); controller.close(); return;
        }
        const { choices: [{ delta: { content: text = '' } = {} } = {}] } = value;
        controller.enqueue(text ?? '');
    } catch (error) { cleanup(); controller.error(error); }
}

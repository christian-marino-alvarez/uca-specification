import { CLOSING_FENCE, DEFAULT_HIGH_WATER_MARK, DEFAULT_MAX_BUFFER_SIZE, EMPTY_SUFFIX, OPENING_FENCE } from './constants.js';
import { Mode, type ParserState } from './types.js';

export function createParser(mode: Mode, maximum = DEFAULT_MAX_BUFFER_SIZE): ReadableWritablePair<Record<string, unknown>, string> {
    const input = new TransformStream<string, string>();
    const { readable, writable } = input;
    const reader = readable.getReader();
    const state: ParserState = { buffer: '', prefix: '', suffix: '', started: false, completed: false, quoted: false, escaped: false, depth: 0, keys: new Set(), document: {}, length: 0, keyLength: 0 };
    const iterator = parseInput(reader, state, mode, maximum);
    return { writable, readable: createParsedStream(iterator, reader) };
}

async function* parseInput(reader: ReadableStreamDefaultReader<string>, state: ParserState, mode: Mode, maximum: number): AsyncGenerator<Record<string, unknown>, void, unknown> {
    for (let result = await reader.read(); !result.done; result = await reader.read()) {
        const { value } = result;
        yield* parseChunk(value, state, mode, maximum);
    }
    finishDocument(state);
    if (mode === Mode.DOCUMENT) {
        const { document } = state;
        yield document;
    }
}

function* parseChunk(chunk: string, state: ParserState, mode: Mode, maximum: number): Generator<Record<string, unknown>, void, unknown> {
    for (let position = 0; position < chunk.length; position++) {
        const entry = consumeCharacter(state, chunk[position], mode);
        enforceBuffer(state, maximum, mode);
        if (entry && (mode === Mode.ENTRIES || mode === Mode.ITEMS)) {
            yield entry;
        }
        if (entry && mode === Mode.DOCUMENT) {
            state.document = { ...state.document, ...entry };
        }
    }
}

function enforceBuffer(state: ParserState, maximum: number, mode: Mode): void {
    const { buffer, prefix, suffix, length, keyLength } = state;
    state.length++;
    const retained = mode === Mode.DOCUMENT ? length + 1 : buffer.length + prefix.length + suffix.length + keyLength;
    if (retained > maximum) {
        throw new RangeError(`Stream buffer exceeds ${maximum} characters`);
    }
}

function consumeCharacter(state: ParserState, character: string, mode: Mode): Record<string, unknown> | undefined {
    const { started, completed, quoted } = state;
    switch (true) {
        case completed: state.suffix += character; return;
        case !started: openDocument(state, character); return;
        case quoted: consumeString(state, character); return;
        default: return consumeToken(state, character, mode);
    }
}

function openDocument(state: ParserState, character: string): void {
    if (character !== '{') {
        state.prefix += character;
        return;
    }
    const { prefix } = state;
    if (!OPENING_FENCE.test(prefix)) {
        throw new SyntaxError('Expected a JSON object at the start of the stream');
    }
    Object.assign(state, { started: true, depth: 1 });
}

function consumeString(state: ParserState, character: string): void {
    const { escaped } = state;
    state.buffer += character;
    switch (true) {
        case escaped: state.escaped = false; break;
        case character === '\\': state.escaped = true; break;
        case character === '"': state.quoted = false; break;
    }
}

function consumeToken(state: ParserState, character: string, mode: Mode): Record<string, unknown> | undefined {
    switch (character) {
        case '"': state.quoted = true; state.buffer += character; return;
        case '{': return handleOpenBrace(state, mode);
        case '[': state.depth++; state.buffer += character; return;
        case '}': return handleCloseBrace(state, mode);
        case ']': state.depth--; state.buffer += character; return;
        case ',': return handleComma(state, mode);
        default: state.buffer += character; return;
    }
}

function handleOpenBrace(state: ParserState, mode: Mode): undefined {
    state.depth++;
    if (mode === Mode.ITEMS && state.depth === 3) {
        state.buffer = '{';
        return;
    }
    state.buffer += '{';
    return;
}

function parseItemBuffer(state: ParserState): Record<string, unknown> | undefined {
    try {
        const item = JSON.parse(state.buffer) as Record<string, unknown>;
        state.buffer = '';
        return item;
    } catch {
        return undefined;
    }
}

function handleCloseBrace(state: ParserState, mode: Mode): Record<string, unknown> | undefined {
    if (mode === Mode.ITEMS && state.depth === 3) {
        state.depth--;
        state.buffer += '}';
        return parseItemBuffer(state);
    }
    return closeBoundary(state, mode);
}

function handleComma(state: ParserState, mode: Mode): Record<string, unknown> | undefined {
    if (mode === Mode.ITEMS && state.depth === 2) {
        return;
    }
    return consumeSeparator(state);
}

function consumeSeparator(state: ParserState): Record<string, unknown> | undefined {
    const { depth } = state;
    if (depth !== 1) {
        state.buffer += ',';
        return;
    }
    return parseEntry(state);
}

function closeBoundary(state: ParserState, mode: Mode): Record<string, unknown> | undefined {
    const { depth } = state;
    if (depth !== 1) {
        state.depth--;
        state.buffer += '}';
        return;
    }
    Object.assign(state, { completed: true, depth: 0 });
    if (mode === Mode.ITEMS) {
        state.buffer = '';
        return undefined;
    }
    return parseEntry(state, true);
}

function parseEntry(state: ParserState, allowEmpty = false): Record<string, unknown> {
    const { buffer, keys } = state;
    const entry = JSON.parse(`{${buffer}}`) as Record<string, unknown>;
    const [key] = Object.keys(entry);
    if ((key === undefined && (!allowEmpty || keys.size > 0)) || keys.has(key)) {
        throw new SyntaxError('Empty or duplicate JSON map entry');
    }
    keys.add(key); state.keyLength += key?.length ?? 0;
    state.buffer = '';
    return entry;
}

function finishDocument(state: ParserState): void {
    const { started, completed, quoted, depth, prefix, suffix } = state;
    if (!started || !completed || quoted || depth !== 0) {
        throw new SyntaxError('Incomplete JSON object at the end of the stream');
    }
    const validSuffix = prefix.includes('```') ? CLOSING_FENCE.test(suffix) : EMPTY_SUFFIX.test(suffix);
    if (!validSuffix) {
        throw new SyntaxError('Unexpected content after the JSON object');
    }
}

function createParsedStream(iterator: AsyncGenerator<Record<string, unknown>, void, unknown>, reader: ReadableStreamDefaultReader<string>): ReadableStream<Record<string, unknown>> {
    return new ReadableStream({
        async pull(controller) { await readParsed(iterator, reader, controller); },
        async cancel(reason) {
            await cancelReader(reader, reason);
            await iterator.return();
        },
    }, { highWaterMark: DEFAULT_HIGH_WATER_MARK });
}

async function readParsed(iterator: AsyncGenerator<Record<string, unknown>, void, unknown>, reader: ReadableStreamDefaultReader<string>, controller: ReadableStreamDefaultController<Record<string, unknown>>): Promise<void> {
    try {
        const result = await iterator.next();
        deliverResult(result, reader, controller);
    }
    catch (error) {
        controller.error(error);
        await cancelReader(reader, error);
    }
}

function deliverResult(result: IteratorResult<Record<string, unknown>, void>, reader: ReadableStreamDefaultReader<string>, controller: ReadableStreamDefaultController<Record<string, unknown>>): void {
    const { done, value } = result;
    if (done) {
        reader.releaseLock();
        controller.close();
        return;
    }
    controller.enqueue(value);
}

async function cancelReader(reader: ReadableStreamDefaultReader<string>, reason: unknown): Promise<void> {
    try {
        await reader.cancel(reason);
    }
    catch { /* An upstream failure already rejects the consumer. */ }
    finally {
        reader.releaseLock();
    }
}

import { ucaItemSchema, type UcaItem } from './schemas/index.js';
import type { GraphNode } from './types.js';

export interface InvalidCandidate {
    readonly raw: string;
    readonly error: unknown;
}

export interface CandidateScanResult {
    readonly validUcas: readonly UcaItem[];
    readonly invalidCandidates: readonly InvalidCandidate[];
}

function checkCandidateSubstring(buffer: string, startIndex: number, endIndex: number): string | undefined {
    const candidate = buffer.slice(startIndex, endIndex + 1);
    const isPotential = candidate.includes('"id"') && candidate.includes('"disposition"');
    return isPotential ? candidate : undefined;
}

function processBrace(char: string, index: number, stack: number[], buffer: string, results: string[]): void {
    if (char === '{') {
        stack.push(index);
        return;
    }
    if (char === '}' && stack.length > 0) {
        const startIndex = stack.pop() ?? 0;
        const candidate = checkCandidateSubstring(buffer, startIndex, index);
        if (candidate) { results.push(candidate); }
    }
}

export function extractCandidateSubstrings(buffer: string): string[] {
    const results: string[] = [];
    const stack: number[] = [];
    let inString = false;
    let escape = false;
    for (let index = 0; index < buffer.length; index++) {
        const char = buffer[index];
        if (escape) { escape = false; continue; }
        escape = char === '\\';
        if (char === '"') { inString = !inString; continue; }
        if (!inString) { processBrace(char, index, stack, buffer, results); }
    }
    return results;
}

function validateParsedCandidate(parsed: unknown, raw: string, valid: UcaItem[], invalid: InvalidCandidate[]): void {
    const isObject = parsed && typeof parsed === 'object';
    if (!isObject || !('id' in parsed) || !('disposition' in parsed)) { return; }
    const validation = ucaItemSchema.safeParse(parsed);
    if (validation.success) {
        valid.push(validation.data);
        return;
    }
    invalid.push({ raw, error: validation.error });
}

function classifyCandidate(raw: string, valid: UcaItem[], invalid: InvalidCandidate[]): void {
    try {
        const parsed = JSON.parse(raw);
        validateParsedCandidate(parsed, raw, valid, invalid);
    } catch {
        // Incomplete or unparseable JSON fragment, safely ignore until fully streamed
    }
}

export function scanUcaCandidates(buffer: string): CandidateScanResult {
    const candidates = extractCandidateSubstrings(buffer);
    const validUcas: UcaItem[] = [];
    const invalidCandidates: InvalidCandidate[] = [];
    for (const candidate of candidates) {
        classifyCandidate(candidate, validUcas, invalidCandidates);
    }
    return { validUcas, invalidCandidates };
}

function handleCharDepth(char: string, openChar: string, closeChar: string, state: { depth: number }): boolean {
    if (char === openChar) { state.depth++; return false; }
    if (char === closeChar) { state.depth--; return state.depth === 0; }
    return false;
}

function findMatching(buffer: string, startIndex: number, openChar: string, closeChar: string): number {
    const state = { depth: 0, inString: false, escape: false };
    for (let i = startIndex; i < buffer.length; i++) {
        const char = buffer[i];
        if (state.escape) { state.escape = false; continue; }
        if (char === '\\') { state.escape = true; continue; }
        if (char === '"') { state.inString = !state.inString; continue; }
        if (!state.inString && handleCharDepth(char, openChar, closeChar, state)) { return i; }
    }
    return -1;
}

function findClosingQuote(buffer: string, startIndex: number): number {
    let escape = false;
    for (let i = startIndex; i < buffer.length; i++) {
        const char = buffer[i];
        if (escape) { escape = false; continue; }
        if (char === '\\') { escape = true; continue; }
        if (char === '"') { return i; }
    }
    return -1;
}

function findStartCursor(buffer: string, startIndex: number): number {
    let cursor = startIndex;
    while (cursor < buffer.length && /\s/.test(buffer[cursor])) { cursor++; }
    return cursor;
}

function resolveEndIndex(buffer: string, cursor: number, char: string): number {
    if (char === '{') { return findMatching(buffer, cursor, '{', '}'); }
    if (char === '[') { return findMatching(buffer, cursor, '[', ']'); }
    if (char === '"') { return findClosingQuote(buffer, cursor + 1); }
    const match = buffer.slice(cursor).match(/^[0-9.eE+-]+|true|false|null/);
    return match ? cursor + match[0].length - 1 : -1;
}

function parseValueSlice(buffer: string, startIndex: number): { value: unknown; endIndex: number } | undefined {
    const cursor = findStartCursor(buffer, startIndex);
    if (cursor >= buffer.length) { return undefined; }
    const endIndex = resolveEndIndex(buffer, cursor, buffer[cursor]);
    if (endIndex === -1) { return undefined; }
    try {
        const raw = buffer.slice(cursor, endIndex + 1);
        return { value: JSON.parse(raw), endIndex };
    } catch {
        return undefined;
    }
}

function validateNodeWithSchema(key: string, value: unknown, schema?: unknown): boolean {
    if (!schema || typeof schema !== 'object' || !('safeParse' in schema)) { return true; }
    const zodSchema = schema as { safeParse: (data: unknown) => { success: boolean }; shape?: Record<string, { safeParse: (d: unknown) => { success: boolean } }> };
    const { shape } = zodSchema;
    if (shape && key in shape) {
        return shape[key].safeParse(value).success;
    }
    return zodSchema.safeParse({ [key]: value }).success;
}

export function scanGraphNodes(buffer: string, schema?: unknown): GraphNode[] {
    const nodes: GraphNode[] = [];
    const keyRegex = /"([a-zA-Z0-9_:-]+)"\s*:\s*/g;
    let match: RegExpExecArray | null;
    while ((match = keyRegex.exec(buffer)) !== null) {
        const key = match[1];
        const result = parseValueSlice(buffer, match.index + match[0].length);
        if (!result) { break; }
        const { value, endIndex } = result;
        keyRegex.lastIndex = endIndex + 1;
        if (validateNodeWithSchema(key, value, schema)) { nodes.push({ key, value }); }
    }
    return nodes;
}


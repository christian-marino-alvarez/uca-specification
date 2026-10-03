import { ucaItemSchema, type UcaItem } from './schema.js';

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

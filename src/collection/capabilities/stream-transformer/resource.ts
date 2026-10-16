import { EventType, type ErrorResult, type Pending, type Response, type Session, type TransformPayload } from './types.js';

export function createSession(payload: TransformPayload, cancelPending: (sessionId: string, error: unknown) => void): Session {
    const { correlationId, streamId, context, signal } = payload;
    const controller = new AbortController(), sessionId = crypto.randomUUID();
    const cancel = () => controller.abort(signal?.reason);
    const { signal: internalSignal } = controller;
    internalSignal.addEventListener(EventType.ABORT, () => { const { reason } = internalSignal; cancelPending(sessionId, reason); }, { once: true });
    signal?.addEventListener(EventType.ABORT, cancel, { once: true });
    if (signal?.aborted) {
        cancel();
    }
    return { sessionId, correlationId, streamId, context, controller, release: () => signal?.removeEventListener(EventType.ABORT, cancel) };
}

export function closeSession(session: Session, error: unknown, notify: (result: ErrorResult) => void): void {
    const { controller, release, correlationId, streamId, context } = session;
    const { signal } = controller;
    release();
    if (error !== undefined && !signal.aborted) {
        notify({ correlationId, streamId, context, error });
    }
    controller.abort(error);
}

export function settlePending(pending: Map<string, Pending>, requestId: string, response: Response): void {
    const entry = pending.get(requestId);
    if (!entry) {
        return;
    }
    const { timer, resolve } = entry;
    pending.delete(requestId);
    clearTimeout(timer);
    resolve(response);
}

export function rejectPending(pending: Map<string, Pending>, sessionId: string, error: unknown): void {
    pending.forEach(({ sessionId: activeSession, timer, reject }, requestId) => {
        if (activeSession !== sessionId) {
            return;
        }
        pending.delete(requestId);
        clearTimeout(timer);
        reject(error);
    });
}

export function expirePending(pending: Map<string, Pending>, requestId: string): void {
    const entry = pending.get(requestId);
    if (!entry) {
        return;
    }
    const { reject } = entry;
    pending.delete(requestId);
    reject(new Error('Stream validation or recovery timed out'));
}

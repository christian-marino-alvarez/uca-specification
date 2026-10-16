import { MAXIMUM_TEXT_LENGTH, MEASUREMENT_TOLERANCE, STYLE_PROPERTIES } from './constants.js';
import { FindingCode, type Descriptor, type Finding, type Focus, type Measurement } from './types.js';

export const measureElement = (element: HTMLElement, descriptor: Descriptor): Measurement => {
    const { parentElement, childNodes, scrollWidth, clientWidth, scrollHeight, clientHeight } = element;
    const { id: parentId = '' } = parentElement ?? {}, { x, y, width, height } = element.getBoundingClientRect();
    const computed = getComputedStyle(element), styles = Object.fromEntries(STYLE_PROPERTIES.map((name) => [name, computed.getPropertyValue(name)]));
    const text = Array.from(childNodes).filter(({ nodeType }) => nodeType === Node.TEXT_NODE).map(({ textContent }) => textContent ?? '').join(' ').trim().slice(0, MAXIMUM_TEXT_LENGTH) || element.getAttribute('placeholder') || '';
    const labelLines = element.tagName === 'BUTTON' && typeof document.createRange().getClientRects === 'function' ? measureLabelLines(element) : 0;
    return { ...descriptor, parentId, text, labelLines, rectangle: { x, y, width, height }, visible: width > 0 && height > 0 && styles.display !== 'none' && styles.visibility !== 'hidden' && styles.opacity !== '0', scrollWidth, clientWidth, scrollHeight, clientHeight, styles };
};

export const inspectFindings = (measurement: Measurement, viewportWidth: number): Finding[] => {
    const { elementId, areaId, visible, labelLines, rectangle: { x, width, height }, scrollWidth, clientWidth, scrollHeight, clientHeight, styles } = measurement;
    const horizontal = scrollWidth > clientWidth + MEASUREMENT_TOLERANCE, vertical = scrollHeight > clientHeight + MEASUREMENT_TOLERANCE;
    const clipped = (horizontal && ['hidden', 'clip'].includes(styles['overflow-x'])) || (vertical && ['hidden', 'clip'].includes(styles['overflow-y']));
    const findings = [...(labelLines > 1 ? [{ code: FindingCode.WRAPPED_ACTION, evidence: `Action label occupies ${labelLines} rendered lines` }] : []), ...(horizontal ? [{ code: FindingCode.HORIZONTAL_OVERFLOW, evidence: `Content width ${scrollWidth}px exceeds available width ${clientWidth}px` }] : []), ...(clipped ? [{ code: FindingCode.CLIPPED_CONTENT, evidence: 'Overflowing content is clipped by its container' }] : []), ...(x < -MEASUREMENT_TOLERANCE || x + width > viewportWidth + MEASUREMENT_TOLERANCE ? [{ code: FindingCode.VIEWPORT_OVERFLOW, evidence: `Horizontal bounds ${x}..${x + width}px exceed viewport ${viewportWidth}px` }] : [])];
    return visible && height > 0 ? findings.map((finding) => ({ ...finding, elementId, areaId })) : [];
};

export const captureFocus = (descriptors: readonly Descriptor[]): Focus | undefined => {
    const element = document.activeElement as HTMLInputElement | null, { id: elementId = '', selectionStart: start = null, selectionEnd: end = null } = element ?? {};
    const { field } = descriptors.find(({ elementId: identifier }) => identifier === elementId) ?? {};
    return descriptors.some(({ elementId: identifier }) => identifier === elementId) ? { elementId, field, start, end } : undefined;
};

export const restoreFocus = (focus: Focus | undefined, descriptors: readonly Descriptor[]): void => {
    if (!focus || (document.activeElement !== document.body && document.activeElement?.id !== focus.elementId)) {
        return;
    }
    const { elementId, field, start, end } = focus, { elementId: replacement = elementId } = descriptors.find(({ field: candidate }) => field !== undefined && candidate === field) ?? {};
    const element = document.getElementById(elementId) ?? document.getElementById(replacement);
    element?.focus({ preventScroll: true });
    if (element instanceof HTMLInputElement && start !== null && end !== null && element.type === 'text') {
        element.setSelectionRange(start, end);
    }
};

export const measureLabelLines = (element: HTMLElement): number => {
    const range = document.createRange(); range.selectNodeContents(element);
    return new Set(Array.from(range.getClientRects()).filter(({ width, height }) => width > 0 && height > 0).map(({ top }) => Math.round(top))).size;
};

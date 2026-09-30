import { DomHarness } from '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { LifecycleEventType } from '../types.js';
import {
    createReactiveElementClass,
    copyElementAttributes,
    copyElementState,
    synchronizeElementAttributes,
    synchronizeElementText,
    mountElementToContainer,
} from '../helpers.js';

function testCreateReactiveElementClass(): void {
    const CustomClass = createReactiveElementClass(['title', 'tag']);
    customElements.define('ext-helper-test', CustomClass);
    assert.deepStrictEqual(CustomClass.observedAttributes, ['title', 'tag']);
    const instance = document.createElement('ext-helper-test');
    assert.ok(instance instanceof HTMLElement);
}

function testElementLifecycleEvents(): void {
    const container = DomHarness.createContainer();
    const element = document.createElement('ext-helper-test');
    let connectedFired = false;
    let attributeFired = false;
    element.addEventListener(LifecycleEventType.CONNECTED, () => { connectedFired = true; });
    element.addEventListener(LifecycleEventType.ATTRIBUTE_CHANGED, () => { attributeFired = true; });
    container.appendChild(element);
    assert.strictEqual(connectedFired, true);
    element.setAttribute('title', 'new-title');
    assert.strictEqual(attributeFired, true);
    container.remove();
}

function testCopyElementAttributes(): void {
    const source = document.createElement('div');
    const target = document.createElement('div');
    source.setAttribute('data-id', '123');
    source.setAttribute('class', 'sample');
    copyElementAttributes(source, target);
    assert.strictEqual(target.getAttribute('data-id'), '123');
    assert.strictEqual(target.getAttribute('class'), 'sample');
}

function testCopyElementState(): void {
    const source = document.createElement('div');
    const target = document.createElement('div');
    source.setAttribute('title', 'Header');
    source.textContent = 'Original Text';
    copyElementState(source, target);
    assert.strictEqual(target.getAttribute('title'), 'Header');
    assert.strictEqual(target.textContent, 'Original Text');
}

function testSynchronizeElementAttributes(): void {
    const element = document.createElement('div');
    synchronizeElementAttributes(element, { 'aria-label': 'Test', 'role': 'button' });
    assert.strictEqual(element.getAttribute('aria-label'), 'Test');
    assert.strictEqual(element.getAttribute('role'), 'button');
}

function testSynchronizeElementText(): void {
    const element = document.createElement('div');
    synchronizeElementText(element, 'Synchronized text');
    assert.strictEqual(element.textContent, 'Synchronized text');
    synchronizeElementText(element, 'Updated text');
    assert.strictEqual(element.textContent, 'Updated text');
}

function testMountElementToContainer(): void {
    const container = document.createElement('div');
    const element = document.createElement('span');
    mountElementToContainer(element, container);
    assert.strictEqual(container.contains(element), true);
    mountElementToContainer(element, container);
    assert.strictEqual(container.children.length, 1);
}

function runAllHelperTests(): void {
    testCreateReactiveElementClass();
    testElementLifecycleEvents();
    testCopyElementAttributes();
    testCopyElementState();
    testSynchronizeElementAttributes();
    testSynchronizeElementText();
    testMountElementToContainer();
    console.log('✔ All WebComponent helpers tests passed successfully.');
}

runAllHelperTests();

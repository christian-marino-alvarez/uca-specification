import { test } from 'node:test';
import assert from 'node:assert';
import { Uca } from '../uca.js';
import { Capability } from '../capability.js';
import type { Cooky } from '../types.js';

class MockChildCapability extends Capability {
  public static override AIM = 'Mock child description';
  public static readonly __ID__ = 'mock-child';
  public static override disposition = {
    aim: { description: 'Default mock child' },
  };
}

class ParentUca extends Uca {
  public static override AIM = 'Parent Uca';
  public static readonly __ID__ = 'parent-uca';

  public exposeCatalog(): Cooky {
    return this.catalog();
  }

  protected override catalog(): Cooky {
    return [
      this.addToCatalog(MockChildCapability, { extraProp: true }),
    ];
  }
}

test('addToCatalog: correctly registers capability and sets disposition and metadata', () => {
  const parent = new ParentUca('parent-1');
  const catalogEntries = parent.exposeCatalog();

  assert.strictEqual(catalogEntries.length, 1);
  const [Factory, disposition] = catalogEntries[0];

  assert.strictEqual(Factory, MockChildCapability);
  assert.strictEqual(disposition.aim.description, 'Mock child description');
  assert.strictEqual((disposition.aim.body as any)?.id, 'parent-1:mock-child');
  assert.strictEqual((disposition.aim.body as any)?.extraProp, true);
});

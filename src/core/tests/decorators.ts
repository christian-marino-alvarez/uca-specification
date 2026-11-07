import { test } from 'node:test';
import assert from 'node:assert';
import {
  onDispositionChanged,
  onDispositionEqual,
  onDispositionPresent,
  onDispositionAbsent,
  onDispositionGreater,
  onDispositionLess,
  onDispositionBetween,
  onDispositionDown,
  onDispositionUp,
} from '../decorators.js';
import { Capability } from '../capability.js';

class ReactiveTestCapability extends Capability<{ status?: string; count?: number; optionalText?: string }> {
  public static override disposition = {
    aim: { description: 'Reactive test', body: { status: 'idle', count: 10 } },
  };

  public statusEvents: string[] = [];
  public readyEvents: string[] = [];
  public countUpEvents: number[] = [];
  public countDownEvents: number[] = [];
  public textPresentEvents: string[] = [];
  public textAbsentEvents: string[] = [];

  @onDispositionChanged('status')
  private onStatusChange(val: string) {
    this.statusEvents.push(val);
  }

  @onDispositionEqual('status', 'ready')
  private onStatusReady(val: string) {
    this.readyEvents.push(val);
  }

  @onDispositionUp('count', 15)
  private onCountUp(val: number) {
    this.countUpEvents.push(val);
  }

  @onDispositionDown('count', 5)
  private onCountDown(val: number) {
    this.countDownEvents.push(val);
  }

  @onDispositionPresent('optionalText')
  private onTextPresent(val: string) {
    this.textPresentEvents.push(val);
  }

  @onDispositionAbsent('optionalText')
  private onTextAbsent(val: string) {
    this.textAbsentEvents.push(val);
  }
}

test('Disposition Decorators: reactive triggers evaluate correctly', () => {
  const cap = new ReactiveTestCapability('test-1');
  const bus = new EventTarget();
  cap.innervate(bus);

  // Initial state is { status: 'idle', count: 10 }
  cap.updateDisposition({ status: 'loading' });
  assert.deepStrictEqual(cap.statusEvents, ['loading']);
  assert.deepStrictEqual(cap.readyEvents, []);

  cap.updateDisposition({ status: 'ready' });
  assert.deepStrictEqual(cap.statusEvents, ['loading', 'ready']);
  assert.deepStrictEqual(cap.readyEvents, ['ready']);

  // Count up test (target ceiling 15)
  cap.updateDisposition({ count: 12 }); // Up, but < 15
  assert.deepStrictEqual(cap.countUpEvents, []);

  cap.updateDisposition({ count: 16 }); // Up and >= 15
  assert.deepStrictEqual(cap.countUpEvents, [16]);

  // Count down test (target floor 5)
  cap.updateDisposition({ count: 8 }); // Down, but > 5
  assert.deepStrictEqual(cap.countDownEvents, []);

  cap.updateDisposition({ count: 4 }); // Down and <= 5
  assert.deepStrictEqual(cap.countDownEvents, [4]);

  // Present / Absent test
  cap.updateDisposition({ optionalText: 'hello' });
  assert.deepStrictEqual(cap.textPresentEvents, ['hello']);
  assert.deepStrictEqual(cap.textAbsentEvents, []);

  cap.updateDisposition({ optionalText: '' });
  assert.deepStrictEqual(cap.textAbsentEvents, ['']);

  cap.denervate();
});

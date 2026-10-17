const bus = new EventTarget();

if (typeof window !== 'undefined') {
    (window as unknown as { __UCA__: unknown }).__UCA__ = {
        bus,
    };
}

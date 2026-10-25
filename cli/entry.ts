import { App } from '@uca/app';

const bus = new EventTarget();

const app = new App();
app.innervate(bus);

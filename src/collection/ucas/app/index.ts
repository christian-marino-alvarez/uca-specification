import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { SignalType as ApiPromptSignalType, type DownloadProgressPayload } from '@uca/capability-api-prompt/types';
import { SignalType as WebLlmSignalType } from '@uca/web-llm/types';
import { Header } from '@uca/header';
import { SignalType as HeaderSignalType } from '@uca/header/types';
import { Content } from '@uca/content';
import { SignalType as ContentSignalType } from '@uca/content/types';
import { Footer } from '@uca/footer';
import { SignalType as FooterSignalType } from '@uca/footer/types';
import { Box } from '@uca/box';
import { SignalType as BoxSignalType } from '@uca/box/types';
import { Action } from '@uca/action';
import { SignalType as ActionSignalType } from '@uca/action/types';
import { WebComponent } from '@uca/capability-web-component';
import { SignalType as WebComponentSignalType } from '@uca/capability-web-component/types';
import { ApiPrompt } from '@uca/capability-api-prompt';
import {
    __ID__,
    DEFAULT_SIGNALS,
} from './constants.js';
import {
    type Body,
    type CreatePayload,
    type StreamPayload,
    DataType,
    SignalType,
} from './types.js';

export class App extends Uca<Body> {
    public static override purpose: string = 'Orchestrate a live responsive web interface explaining the Universal Cognitive Architecture (UCA)';

    public static override disposition: Disposition<Body> = {
        aim: { description: App.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.CREATE, type: DataType.PAYLOAD, description: 'Request full application scaffolding' },
            { signal: SignalType.STREAM, type: DataType.PAYLOAD, description: 'Request streaming application scaffolding' },
            { signal: SignalType.DESTROY, type: DataType.VOID, description: 'Cancel scaffolding operations' },
            { signal: ApiPromptSignalType.DOWNLOADING, type: DataType.RECORD, description: 'Local model download progress' },
            { signal: WebLlmSignalType.READY, type: DataType.RECORD, description: 'Local model ready for inference' },
            { signal: ActionSignalType.TRIGGERED, type: DataType.RECORD, description: 'User action to generate scaffolding' },
            { signal: HeaderSignalType.CHUNK, type: DataType.RECORD, description: 'Header layout chunk' },
            { signal: HeaderSignalType.STREAMED, type: DataType.STREAM, description: 'Header layout stream' },
            { signal: HeaderSignalType.CREATED, type: DataType.RECORD, description: 'Header layout completed' },
            { signal: HeaderSignalType.ERROR, type: DataType.RECORD, description: 'Header layout error' },
            { signal: ContentSignalType.CHUNK, type: DataType.RECORD, description: 'Content layout chunk' },
            { signal: ContentSignalType.STREAMED, type: DataType.STREAM, description: 'Content layout stream' },
            { signal: ContentSignalType.CREATED, type: DataType.RECORD, description: 'Content layout completed' },
            { signal: ContentSignalType.ERROR, type: DataType.RECORD, description: 'Content layout error' },
            { signal: FooterSignalType.CHUNK, type: DataType.RECORD, description: 'Footer layout chunk' },
            { signal: FooterSignalType.STREAMED, type: DataType.STREAM, description: 'Footer layout stream' },
            { signal: FooterSignalType.CREATED, type: DataType.RECORD, description: 'Footer layout completed' },
            { signal: FooterSignalType.ERROR, type: DataType.RECORD, description: 'Footer layout error' },
        ],
        outputs: [
            { signal: SignalType.CREATED, type: DataType.RECORD, description: 'Application scaffold created' },
            { signal: SignalType.STREAMED, type: DataType.STREAM, description: 'Application scaffold stream' },
            { signal: SignalType.CHUNK, type: DataType.RECORD, description: 'Application scaffold node chunk' },
            { signal: SignalType.LOADING, type: DataType.BOOLEAN, description: 'Local model loading status' },
            { signal: SignalType.PROGRESS, type: DataType.NUMBER, description: 'Local model download progress percentage' },
            { signal: SignalType.DESTROYED, type: DataType.RECORD, description: 'Application destroyed confirmation' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Application error' },
            { signal: HeaderSignalType.STREAM, type: DataType.PAYLOAD, description: 'Stream header layout' },
            { signal: HeaderSignalType.CREATE, type: DataType.PAYLOAD, description: 'Create header layout' },
            { signal: ContentSignalType.STREAM, type: DataType.PAYLOAD, description: 'Stream content layout' },
            { signal: ContentSignalType.CREATE, type: DataType.PAYLOAD, description: 'Create content layout' },
            { signal: FooterSignalType.STREAM, type: DataType.PAYLOAD, description: 'Stream footer layout' },
            { signal: FooterSignalType.CREATE, type: DataType.PAYLOAD, description: 'Create footer layout' },
            { signal: BoxSignalType.CREATE, type: DataType.RECORD, description: 'Create section box views' },
            { signal: BoxSignalType.UPDATE, type: DataType.RECORD, description: 'Update section box chunks' },
            { signal: BoxSignalType.REMOVE, type: DataType.RECORD, description: 'Remove section box views' },
            { signal: ActionSignalType.CREATE, type: DataType.RECORD, description: 'Create action button' },
            { signal: ActionSignalType.UPDATE, type: DataType.RECORD, description: 'Update action button' },
            { signal: WebComponentSignalType.RENDERED, type: DataType.RECORD, description: 'Mount application view' },
            { signal: WebComponentSignalType.UPDATED, type: DataType.RECORD, description: 'Update application view text' },
            { signal: WebComponentSignalType.REMOVED, type: DataType.RECORD, description: 'Remove application view' },
            { signal: WebLlmSignalType.CREATE, type: DataType.RECORD, description: 'Preload model on innervation' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        super.innervate(target, disposition);
        this.mountInitialView();
        return this;
    }

    public override denervate(): void {
        super.denervate();
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.CREATE:
                this.handleCreate(value);
                break;
            case SignalType.STREAM:
                this.handleStream(value);
                break;
            case SignalType.DESTROY:
                this.handleDestroy();
                break;
            case ApiPromptSignalType.DOWNLOADING:
                this.handleDownloading(value);
                break;
            case WebLlmSignalType.READY:
                this.handleReady();
                break;
            case ActionSignalType.TRIGGERED:
                this.handleActionTriggered(value);
                break;
            case HeaderSignalType.CHUNK:
                this.handleHeaderChunk(value);
                break;
            case HeaderSignalType.STREAMED:
                this.handleHeaderStreamed(value);
                break;
            case HeaderSignalType.CREATED:
                this.handleHeaderCreated(value);
                break;
            case HeaderSignalType.ERROR:
                this.handleHeaderError(value);
                break;
            case ContentSignalType.CHUNK:
                this.handleContentChunk(value);
                break;
            case ContentSignalType.STREAMED:
                this.handleContentStreamed(value);
                break;
            case ContentSignalType.CREATED:
                this.handleContentCreated(value);
                break;
            case ContentSignalType.ERROR:
                this.handleContentError(value);
                break;
            case FooterSignalType.CHUNK:
                this.handleFooterChunk(value);
                break;
            case FooterSignalType.STREAMED:
                this.handleFooterStreamed(value);
                break;
            case FooterSignalType.CREATED:
                this.handleFooterCreated(value);
                break;
            case FooterSignalType.ERROR:
                this.handleFooterError(value);
                break;
            default:
                break;
        }
    }

    protected override capabilities(): Cooky {
        const domainItems = this.createDomainCapabilities();
        const presentationItems = this.createPresentationCapabilities();
        return [...domainItems, ...presentationItems];
    }

    private createDomainCapabilities(): Cooky {
        const { reactTo: headerSignals = [] } = Header.disposition;
        const { reactTo: contentSignals = [] } = Content.disposition;
        const { reactTo: footerSignals = [] } = Footer.disposition;
        const header = [Header, { aim: { description: Header.purpose, body: {} }, reactTo: [...headerSignals] }] as Cooky[number];
        const content = [Content, { aim: { description: Content.purpose, body: {} }, reactTo: [...contentSignals] }] as Cooky[number];
        const footer = [Footer, { aim: { description: Footer.purpose, body: {} }, reactTo: [...footerSignals] }] as Cooky[number];
        return [header, content, footer];
    }

    private createPresentationCapabilities(): Cooky {
        const { reactTo: boxSignals = [] } = Box.disposition;
        const { reactTo: viewSignals = [] } = WebComponent.disposition;
        const { reactTo: actionSignals = [] } = Action.disposition;
        const boxes = this.createBoxCapabilities(boxSignals);
        const view = [WebComponent, { aim: { description: 'App view', body: { id: `${this.id}:view` } }, reactTo: [...viewSignals] }] as Cooky[number];
        const action = [Action, { aim: { description: 'Generate action', body: { id: 'action:generate' } }, reactTo: [...actionSignals] }] as Cooky[number];
        return [...boxes, view, action];
    }

    private createBoxCapabilities(signals: readonly string[]): Cooky {
        return ['box:header', 'box:content', 'box:footer'].map((id) => {
            return [Box, { aim: { description: `${id} container`, body: { id, text: `⏳ ${id}...` } }, reactTo: [...signals] }] as Cooky[number];
        });
    }

    protected override matchesId(id?: string): boolean {
        if (!id || id === this.id) { return true; }
        return this.hasCapability(id) || super.matchesId(id);
    }

    private mountInitialView(): void {
        const text = '⏳ Scaffolding UCA: esperando a que la GPU cargue el modelo...';
        this.pulse(WebComponentSignalType.RENDERED, { id: `${this.id}:view`, text });
        this.pulse(ActionSignalType.CREATE, { id: 'action:generate', label: '⏳ Cargando GPU (~8s primera vez)...', disabled: true });
        this.pulse(BoxSignalType.CREATE, { id: 'box:header', text: '⏳ Header: en espera de GPU...' });
        this.pulse(BoxSignalType.CREATE, { id: 'box:content', text: '⏳ Content: en espera...' });
        this.pulse(BoxSignalType.CREATE, { id: 'box:footer', text: '⏳ Footer: en espera...' });
        void this.watchGpuReadiness();
    }

    private async watchGpuReadiness(): Promise<void> {
        const ready = await ApiPrompt.whenReady();
        if (!ready) { return; }
        const label = '🚀 Generar Scaffolding';
        const text = '⚡ Gemini Nano listo en GPU VRAM. Pulsa el botón para iniciar.';
        this.pulse(ActionSignalType.UPDATE, { id: 'action:generate', label, disabled: false });
        this.pulse(WebComponentSignalType.UPDATED, { id: `${this.id}:view`, text });
        this.pulse(BoxSignalType.UPDATE, { id: 'box:header', text: '⚡ Listo. Pulsa "Generar Scaffolding" para comenzar.' });
    }

    private handleActionTriggered(value?: unknown): void {
        const label = '⚡ Generando layout...';
        const text = '⏳ Scaffolding secuencial: iniciando Header...';
        this.pulse(ActionSignalType.UPDATE, { id: 'action:generate', label, disabled: true });
        this.pulse(WebComponentSignalType.UPDATED, { id: `${this.id}:view`, text });
        this.pulse(BoxSignalType.UPDATE, { id: 'box:header', text: '⏳ Header: iniciando stream...' });
        this.pulse(HeaderSignalType.STREAM, { model: 'local' });
    }

    private handleCreate(value: unknown): void {
        const { model = 'local', ...rest } = (value ?? {}) as CreatePayload;
        this.pulse(SignalType.LOADING, { loading: true, message: `Iniciando layout (${model})...` });
        this.pulse(HeaderSignalType.STREAM, { model, ...rest });
    }

    private handleStream(value: unknown): void {
        const { model = 'local', ...rest } = (value ?? {}) as StreamPayload;
        this.pulse(SignalType.LOADING, { loading: true, message: `Iniciando streaming layout (${model})...` });
        this.pulse(HeaderSignalType.STREAM, { model, ...rest });
    }

    private handleDownloading(value: unknown): void {
        const { percentage = 0, loaded, total } = (value ?? {}) as DownloadProgressPayload;
        const message = `⏳ Descargando modelo local: ${percentage}% (${loaded}/${total})`;
        console.log(`[${this.id}] ${message}`);
        this.pulse(SignalType.LOADING, { loading: true, message });
        this.pulse(SignalType.PROGRESS, { percentage, loaded, total });
        this.pulse(WebComponentSignalType.UPDATED, { id: `${this.id}:view`, text: message });
    }

    private handleReady(): void {
        const message = '⚡ Modelo local listo';
        console.log(`[${this.id}] ${message}`);
        this.pulse(SignalType.LOADING, { loading: false, message });
        this.pulse(WebComponentSignalType.UPDATED, { id: `${this.id}:view`, text: message });
    }

    private handleHeaderChunk(value: unknown): void {
        this.emitChunkView('Header', value);
    }

    private handleContentChunk(value: unknown): void {
        this.emitChunkView('Content', value);
    }

    private handleFooterChunk(value: unknown): void {
        this.emitChunkView('Footer', value);
    }

    private emitChunkView(section: string, value: unknown): void {
        const { chunk } = (value ?? {}) as { chunk?: Record<string, unknown> };
        const payload = chunk ?? (value as Record<string, unknown>);
        if (!payload || Object.keys(payload).length === 0) { return; }
        const boxId = `box:${section.toLowerCase()}`;
        const chunkText = `[${section}]\n${JSON.stringify(payload, null, 2)}`;
        console.log(`[${this.id}] ${section} chunk:`, payload);
        this.pulse(BoxSignalType.UPDATE, { id: boxId, text: chunkText });
        this.pulse(SignalType.CHUNK, value);
    }

    private handleHeaderStreamed(value: unknown): void {
        console.log(`[${this.id}] Header stream started:`, value);
        this.pulse(SignalType.STREAMED, value);
    }

    private handleContentStreamed(value: unknown): void {
        console.log(`[${this.id}] Content stream started:`, value);
        this.pulse(SignalType.STREAMED, value);
    }

    private handleFooterStreamed(value: unknown): void {
        console.log(`[${this.id}] Footer stream started:`, value);
        this.pulse(SignalType.STREAMED, value);
    }

    private handleHeaderCreated(value: unknown): void {
        this.emitSectionCompleted('Header', value);
        this.pulse(BoxSignalType.UPDATE, { id: 'box:content', text: '⏳ Content: iniciando stream...' });
        this.pulse(ContentSignalType.STREAM, { model: 'local' });
    }

    private handleContentCreated(value: unknown): void {
        this.emitSectionCompleted('Content', value);
        this.pulse(BoxSignalType.UPDATE, { id: 'box:footer', text: '⏳ Footer: iniciando stream...' });
        this.pulse(FooterSignalType.STREAM, { model: 'local' });
    }

    private handleFooterCreated(value: unknown): void {
        this.emitSectionCompleted('Footer', value);
        const text = '✅ Scaffolding completado con éxito';
        this.pulse(WebComponentSignalType.UPDATED, { id: `${this.id}:view`, text });
        this.pulse(ActionSignalType.UPDATE, { id: 'action:generate', label: '🔄 Regenerar Scaffolding', disabled: false });
    }

    private handleHeaderError(value: unknown): void {
        this.emitSectionError('Header', value);
        this.pulse(BoxSignalType.UPDATE, { id: 'box:content', text: '⏳ Content: iniciando stream...' });
        this.pulse(ContentSignalType.STREAM, { model: 'local' });
    }

    private handleContentError(value: unknown): void {
        this.emitSectionError('Content', value);
        this.pulse(BoxSignalType.UPDATE, { id: 'box:footer', text: '⏳ Footer: iniciando stream...' });
        this.pulse(FooterSignalType.STREAM, { model: 'local' });
    }

    private handleFooterError(value: unknown): void {
        this.emitSectionError('Footer', value);
        const text = '❌ Error en la generación del Footer';
        this.pulse(WebComponentSignalType.UPDATED, { id: `${this.id}:view`, text });
        this.pulse(ActionSignalType.UPDATE, { id: 'action:generate', label: '🔄 Reintentar', disabled: false });
    }

    private emitSectionCompleted(section: string, value: unknown): void {
        const { scaffold } = (value ?? {}) as { scaffold?: Record<string, unknown> };
        const payload = scaffold ?? (value as Record<string, unknown>);
        const boxId = `box:${section.toLowerCase()}`;
        const text = `✅ ${section} completado:\n${JSON.stringify(payload, null, 2)}`;
        console.log(`[${this.id}] ${section} completed:`, payload);
        this.pulse(BoxSignalType.UPDATE, { id: boxId, text });
        this.pulse(SignalType.CREATED, value);
    }

    private emitSectionError(section: string, value: unknown): void {
        const { error } = (value ?? {}) as { error?: string };
        const boxId = `box:${section.toLowerCase()}`;
        const message = error ?? String(value);
        const text = `❌ ${section} error:\n${message}`;
        console.error(`[${this.id}] ${section} error:`, value);
        this.pulse(BoxSignalType.UPDATE, { id: boxId, text });
        this.pulse(SignalType.ERROR, { section: section.toLowerCase(), error: value });
    }

    private handleDestroy(): void {
        this.pulse(WebComponentSignalType.REMOVED, { id: `${this.id}:view` });
        this.pulse(BoxSignalType.REMOVE, { id: 'box:header' });
        this.pulse(BoxSignalType.REMOVE, { id: 'box:content' });
        this.pulse(BoxSignalType.REMOVE, { id: 'box:footer' });
        this.pulse(HeaderSignalType.DESTROY, {});
        this.pulse(ContentSignalType.DESTROY, {});
        this.pulse(FooterSignalType.DESTROY, {});
        this.pulse(SignalType.DESTROYED, { destroyed: true });
    }
}

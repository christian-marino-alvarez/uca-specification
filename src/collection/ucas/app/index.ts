import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { SignalType as ApiPromptSignalType, type DownloadProgressPayload } from '@uca/capability-api-prompt/types';
import { SignalType as WebLlmSignalType } from '@uca/web-llm/types';
import { Content } from '@uca/content';
import { SignalType as ContentSignalType } from '@uca/content/types';
import { Footer } from '@uca/footer';
import { SignalType as FooterSignalType } from '@uca/footer/types';
import { Box } from '@uca/box';
import { SignalType as BoxSignalType } from '@uca/box/types';
import { Action } from '@uca/action';
import { SignalType as ActionSignalType } from '@uca/action/types';
import { ApiPrompt } from '@uca/capability-api-prompt';
import {
    __ID__,
    DEFAULT_GOAL,
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
            { signal: ContentSignalType.STREAM, type: DataType.PAYLOAD, description: 'Stream content layout' },
            { signal: ContentSignalType.CREATE, type: DataType.PAYLOAD, description: 'Create content layout' },
            { signal: FooterSignalType.STREAM, type: DataType.PAYLOAD, description: 'Stream footer layout' },
            { signal: FooterSignalType.CREATE, type: DataType.PAYLOAD, description: 'Create footer layout' },
            { signal: BoxSignalType.CREATE, type: DataType.RECORD, description: 'Create section box views' },
            { signal: BoxSignalType.UPDATE, type: DataType.RECORD, description: 'Update section box chunks' },
            { signal: BoxSignalType.REMOVE, type: DataType.RECORD, description: 'Remove section box views' },
            { signal: ActionSignalType.CREATE, type: DataType.RECORD, description: 'Create action button' },
            { signal: ActionSignalType.UPDATE, type: DataType.RECORD, description: 'Update action button' },
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
        const { reactTo: contentSignals = [] } = Content.disposition;
        const { reactTo: footerSignals = [] } = Footer.disposition;
        const content = [Content, { aim: { description: Content.purpose, body: {} }, reactTo: [...contentSignals] }] as Cooky[number];
        const footer = [Footer, { aim: { description: Footer.purpose, body: {} }, reactTo: [...footerSignals] }] as Cooky[number];
        return [content, footer];
    }

    private createPresentationCapabilities(): Cooky {
        const { reactTo: boxSignals = [] } = Box.disposition;
        const { reactTo: actionSignals = [] } = Action.disposition;
        const boxes = this.createBoxCapabilities(boxSignals);
        const action = [Action, { aim: { description: 'Submit action', body: { id: 'action:submit' } }, reactTo: [...actionSignals] }] as Cooky[number];
        return [...boxes, action];
    }

    private createBoxCapabilities(signals: readonly string[]): Cooky {
        return ['box:content', 'box:emergent', 'box:footer'].map((id) => {
            return [Box, { aim: { description: `${id} container`, body: { id, text: '' } }, reactTo: [...signals] }] as Cooky[number];
        });
    }

    protected override matchesId(id?: string): boolean {
        if (!id || id === this.id) { return true; }
        return this.hasCapability(id) || super.matchesId(id);
    }

    private mountInitialView(): void {
        this.pulse(BoxSignalType.CREATE, { id: 'box:content' });
        this.pulse(BoxSignalType.CREATE, { id: 'box:emergent', text: '' });
        this.pulse(BoxSignalType.CREATE, { id: 'box:footer', text: 'UCA · Universal Cognitive Architecture' });
        this.pulse(ActionSignalType.CREATE, { id: 'action:submit', label: '→', disabled: false });
        this.updateStatus('⚡ Sistema UCA preparado');
        void this.watchGpuReadiness();
    }

    private updateStatus(message: string, busy?: boolean): void {
        if (typeof document !== 'undefined') {
            const container = document.getElementById('app:status');
            const textElement = document.getElementById('app:status-text');
            if (textElement) { textElement.textContent = message; }
            if (container && busy !== undefined) { container.classList.toggle('busy', busy); }
        }
        if (busy !== undefined) {
            this.pulse(SignalType.LOADING, { loading: busy, message });
        }
    }

    private async watchGpuReadiness(): Promise<void> {
        const ready = await ApiPrompt.whenReady();
        if (!ready) { return; }
        this.pulse(ActionSignalType.UPDATE, { id: 'action:submit', label: '→', disabled: false });
    }

    private handleActionTriggered(value?: unknown): void {
        const { request } = (value ?? {}) as { request?: string };
        const query = request || DEFAULT_GOAL;
        this.pulse(ActionSignalType.UPDATE, { id: 'action:submit', disabled: true });
        this.updateStatus(`🧠 Razonando espacios para "${query}"...`, true);
        this.pulse(BoxSignalType.UPDATE, { id: 'box:emergent', text: `⚡ Razonando para: "${query}"...` });
        this.pulse(ContentSignalType.STREAM, { request: query, model: 'local', forceRefresh: true });
    }

    private handleCreate(value: unknown): void {
        const { model = 'local', request = DEFAULT_GOAL, ...rest } = (value ?? {}) as CreatePayload;
        this.updateStatus(`Iniciando layout (${model})...`, true);
        this.pulse(ContentSignalType.STREAM, { model, request, ...rest });
    }

    private handleStream(value: unknown): void {
        const { model = 'local', request = DEFAULT_GOAL, ...rest } = (value ?? {}) as StreamPayload;
        this.updateStatus(`Iniciando streaming layout (${model})...`, true);
        this.pulse(ContentSignalType.STREAM, { model, request, ...rest });
    }

    private handleDownloading(value: unknown): void {
        const { percentage = 0, loaded, total } = (value ?? {}) as DownloadProgressPayload;
        const message = `⏳ Descargando modelo: ${percentage}% (${loaded}/${total})`;
        this.updateStatus(message, true);
        this.pulse(SignalType.PROGRESS, { percentage, loaded, total });
        this.pulse(BoxSignalType.UPDATE, { id: 'box:emergent', text: message });
    }

    private handleReady(): void {
        this.updateStatus('⚡ Modelo local listo en GPU', false);
        this.pulse(ActionSignalType.UPDATE, { id: 'action:submit', label: '→', disabled: false });
    }

    private handleContentChunk(value: unknown): void {
        this.updateStatus('🎨 Materializando nodos cognitivos...', true);
        this.emitChunkView('Content', value);
    }

    private handleFooterChunk(value: unknown): void {
        this.emitChunkView('Footer', value);
    }

    private emitChunkView(section: string, value: unknown): void {
        const { chunk } = (value ?? {}) as { chunk?: Record<string, unknown> };
        const payload = chunk ?? (value as Record<string, unknown>);
        if (!payload || Object.keys(payload).length === 0) { return; }
        const boxId = section === 'Content' ? 'box:emergent' : 'box:footer';
        const chunkText = `[${section}]\n${JSON.stringify(payload, null, 2)}`;
        this.pulse(BoxSignalType.UPDATE, { id: boxId, text: chunkText });
        this.pulse(SignalType.CHUNK, value);
    }

    private handleContentStreamed(value: unknown): void {
        this.pulse(SignalType.STREAMED, value);
    }

    private handleFooterStreamed(value: unknown): void {
        this.pulse(SignalType.STREAMED, value);
    }

    private handleContentCreated(value: unknown): void {
        this.emitSectionCompleted('Content', value);
        this.updateStatus('✅ Scaffolding UCA completado', false);
        this.pulse(ActionSignalType.UPDATE, { id: 'action:submit', disabled: false });
        this.pulse(FooterSignalType.STREAM, { model: 'local' });
    }

    private handleFooterCreated(value: unknown): void {
        this.emitSectionCompleted('Footer', value);
        this.pulse(ActionSignalType.UPDATE, { id: 'action:submit', disabled: false });
    }

    private handleContentError(value: unknown): void {
        this.emitSectionError('Content', value);
        this.updateStatus('❌ Error en el razonamiento', false);
        this.pulse(ActionSignalType.UPDATE, { id: 'action:submit', disabled: false });
        this.pulse(FooterSignalType.STREAM, { model: 'local' });
    }

    private handleFooterError(value: unknown): void {
        this.emitSectionError('Footer', value);
        this.pulse(ActionSignalType.UPDATE, { id: 'action:submit', disabled: false });
    }

    private emitSectionCompleted(section: string, value: unknown): void {
        const { scaffold } = (value ?? {}) as { scaffold?: Record<string, unknown> };
        const payload = scaffold ?? (value as Record<string, unknown>);
        const boxId = section === 'Content' ? 'box:emergent' : 'box:footer';
        const text = `✅ ${section} completado:\n${JSON.stringify(payload, null, 2)}`;
        this.pulse(BoxSignalType.UPDATE, { id: boxId, text });
        this.pulse(SignalType.CREATED, value);
    }

    private emitSectionError(section: string, value: unknown): void {
        const { error } = (value ?? {}) as { error?: string };
        const boxId = section === 'Content' ? 'box:emergent' : 'box:footer';
        const message = error ?? String(value);
        this.pulse(BoxSignalType.UPDATE, { id: boxId, text: `❌ ${section} error:\n${message}` });
        this.pulse(SignalType.ERROR, { section: section.toLowerCase(), error: value });
    }

    private handleDestroy(): void {
        this.pulse(BoxSignalType.REMOVE, { id: 'box:content' });
        this.pulse(BoxSignalType.REMOVE, { id: 'box:emergent' });
        this.pulse(BoxSignalType.REMOVE, { id: 'box:footer' });
        this.pulse(ContentSignalType.DESTROY, {});
        this.pulse(FooterSignalType.DESTROY, {});
        this.pulse(SignalType.DESTROYED, { destroyed: true });
    }
}

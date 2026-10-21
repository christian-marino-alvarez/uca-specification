import { Capability } from '@uca/core/capability';
import type {
    Disposition,
    Signal,
} from '@uca/core/types';
import {
    AIM,
    DEFAULT_SPECIFICATION_SOURCE,
    DEFAULT_WEB_SOURCE,
    __ID__,
} from './constants.js';
import { parseSpecification } from './parser.js';
import {
    parsePayloadSchema,
    specificationModelSchema,
} from './schema.js';
import {
    DataType,
    SignalType,
    type Body,
    type ParsePayload,
    type SpecificationModel,
} from './types.js';

export class Specification extends Capability<Body> {
    public static readonly AIM: string = AIM;
    public static readonly __ID__: string = __ID__;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: AIM,
            body: {
                source: DEFAULT_SPECIFICATION_SOURCE,
            },
        },
        reactTo: [
            SignalType.LOAD,
            SignalType.PARSE,
            SignalType.GET,
        ],
        inputs: [
            {
                signal: SignalType.LOAD,
                type: DataType.PARSE_PAYLOAD,
                schema: parsePayloadSchema,
                description: 'Load and parse specification from source path or URL',
            },
            {
                signal: SignalType.PARSE,
                type: DataType.PARSE_PAYLOAD,
                schema: parsePayloadSchema,
                description: 'Parse raw markdown content into specification model',
            },
            {
                signal: SignalType.GET,
                type: DataType.VOID,
                description: 'Get current active specification model',
            },
        ],
        outputs: [
            {
                signal: SignalType.PARSED,
                type: DataType.SPECIFICATION_MODEL,
                schema: specificationModelSchema,
                description: 'Specification parsed and structured into data model',
            },
            {
                signal: SignalType.PROVIDED,
                type: DataType.SPECIFICATION_MODEL,
                schema: specificationModelSchema,
                description: 'Active specification model provided',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
                description: 'Error emitted during specification read or parsing',
            },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override async react(signal: Signal): Promise<void> {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.LOAD:
                await this.handleLoad(signal);
                break;
            case SignalType.PARSE:
                this.handleParse(signal);
                break;
            case SignalType.GET:
                this.handleGet();
                break;
            default:
                break;
        }
    }

    private resolveSource(value?: unknown): string {
        const {
            source,
        } = (value ?? {}) as ParsePayload;
        const {
            aim,
        } = this.disposition;
        const {
            source: configuredSource = DEFAULT_SPECIFICATION_SOURCE,
        } = aim.body ?? {};
        return source ?? configuredSource;
    }

    private async handleLoad(signal: Signal): Promise<void> {
        const {
            value,
        } = signal;
        const source = this.resolveSource(value);
        try {
            const content = await this.fetchMarkdown(source);
            const model = parseSpecification(content, source);
            this.pulse(SignalType.PARSED, model);
        } catch (error) {
            this.handleLoadError(error, source);
        }
    }

    private handleLoadError(error: unknown, source: string): void {
        const fallbackModel = parseSpecification('', source);
        this.pulse(SignalType.PARSED, fallbackModel);
        this.pulse(SignalType.ERROR, {
            error: String(error),
            source,
        });
    }

    private async fetchMarkdown(source: string): Promise<string> {
        const isBrowser = typeof window !== 'undefined';
        if (isBrowser) {
            const url = source.startsWith('http') || source.startsWith('/') ? source : DEFAULT_WEB_SOURCE;
            const response = await fetch(url);
            return response.text();
        }
        return this.readFilesystemMarkdown(source);
    }

    private async readFilesystemMarkdown(source: string): Promise<string> {
        const fsModule = await import('node:fs');
        const pathModule = await import('node:path');
        const targetPath = pathModule.resolve(process.cwd(), source);
        return fsModule.readFileSync(targetPath, 'utf-8');
    }

    private handleParse(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            content = '',
            source = DEFAULT_SPECIFICATION_SOURCE,
        } = (value ?? {}) as ParsePayload;
        const model = parseSpecification(content, source);
        this.pulse(SignalType.PARSED, model);
    }

    private handleGet(): void {
        const {
            aim,
        } = this.disposition;
        const {
            model = parseSpecification('', DEFAULT_SPECIFICATION_SOURCE),
        } = aim.body ?? {};
        this.pulse(SignalType.PROVIDED, model);
    }
}

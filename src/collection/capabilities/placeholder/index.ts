import { Capability } from '@uca/core/capability';
import type {
    Disposition,
    Signal,
} from '@uca/core/types';
import {
    COMPACT_WIDTHS,
    DEFAULT_KIND,
    LINE_SHAPE,
    SHAPES,
    SHIMMER_FILL,
    SHIMMER_GRADIENT,
    __ID__,
} from './constants.js';
import {
    errorSchema,
    requestSchema,
    resultSchema,
} from './schema.js';
import {
    type Body,
    type Request,
    DataType,
    SignalType,
} from './types.js';

export class Placeholder extends Capability<Body> {
    public static readonly AIM = 'Generate a loading placeholder image for a declared visual area';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Placeholder.AIM,
        },
        reactTo: [
            SignalType.GENERATE,
        ],
        inputs: [
            {
                signal: SignalType.GENERATE,
                type: DataType.REQUEST,
                schema: requestSchema,
                description: 'Generate a placeholder image source',
            },
        ],
        outputs: [
            {
                signal: SignalType.GENERATED,
                type: DataType.RESULT,
                schema: resultSchema,
                description: 'Placeholder image source generated',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
                schema: errorSchema,
                description: 'Placeholder image source generation failed',
            },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.GENERATE:
                this.handleGenerate(signal);
                break;
        }
    }

    private handleGenerate(signal: Signal): void {
        const {
            value,
        } = signal;
        const parsed = requestSchema.safeParse(value);
        if (!parsed.success) {
            this.pulse(SignalType.ERROR, {
                areaId: null,
                error: parsed.error.message,
            });
            return;
        }
        const {
            data: request,
        } = parsed;
        const {
            areaId,
            context,
        } = request;
        this.pulse(SignalType.GENERATED, {
            areaId,
            source: this.createSource(request),
            ...(context !== undefined && {
                context,
            }),
        });
    }

    private createSource(request: Request): string {
        const {
            kind = DEFAULT_KIND,
            dimensions = {},
        } = request;
        const {
            height: customHeight,
            width,
        } = dimensions;
        const {
            height: defaultHeight,
            elements,
        } = SHAPES[kind.toLowerCase()] ?? LINE_SHAPE;
        const height = typeof customHeight === 'number' ? customHeight : defaultHeight;
        const compact = `<rect x="0" y="0" width="100%" height="${height}" rx="8" ${SHIMMER_FILL}/>`;
        const content = COMPACT_WIDTHS.includes(String(width)) ? compact : elements;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${height}">${SHIMMER_GRADIENT}${content}</svg>`;
        return `data:image/svg+xml;utf8,${svg}`;
    }
}

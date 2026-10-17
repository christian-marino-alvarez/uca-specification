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
    PALETTES,
    SHAPE_STYLES,
    MOTION_STYLES,
    VIEWBOX_WIDTH,
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
            appearance,
        } = request;
        const {
            width,
        } = dimensions;
        const {
            height,
            elements,
        } = SHAPES[kind.toLowerCase()] ?? LINE_SHAPE;
        const {
            colorScheme,
            reducedMotion = false,
        } = appearance ?? {};
        const palette = colorScheme === 'light' ? PALETTES.light : PALETTES.dark;
        const compact = `<rect class="line" width="${VIEWBOX_WIDTH}" height="${height}" rx="12"/>`;
        const content = COMPACT_WIDTHS.includes(String(width)) ? compact : elements;
        const styles = `${palette}${SHAPE_STYLES}${reducedMotion ? '' : MOTION_STYLES}`;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${VIEWBOX_WIDTH}" height="${height}" viewBox="0 0 ${VIEWBOX_WIDTH} ${height}"><style>${styles}</style>${content}</svg>`;
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }
}

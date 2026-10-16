import { Capability } from '@uca/core/capability';
import type {
    Disposition,
    Signal,
} from '@uca/core/types';
import {
    SignalType as SkeletonSignalType,
} from '@uca/skeleton/types';
import {
    __ID__,
} from './constants.js';
import {
    streamEntrySchema,
    streamRequestSchema,
    errorSchema,
    requestSchema,
    resultSchema,
} from './schema.js';
import {
    type Area,
    type Body,
    type Request,
    type StreamRequest,
    DataType,
    SignalType,
} from './types.js';

export class Render extends Capability<Body> {
    public static readonly AIM = 'Consume a validated structural area stream and translate every area into a Skeleton rendering request';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Render.AIM,
        },
        reactTo: [
            SignalType.STREAM,
        ],
        inputs: [
            {
                signal: SignalType.STREAM,
                type: DataType.STREAM_REQUEST,
                schema: streamRequestSchema,
                description: 'Render a validated stream of structural areas',
            },
        ],
        outputs: [
            {
                signal: SignalType.AREA_RENDERED,
                type: DataType.RESULT,
                schema: resultSchema,
                description: 'Area rendering was delegated to terminal visual capabilities',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
                schema: errorSchema,
                description: 'Area rendering could not be delegated',
            },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void | Promise<void> {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.STREAM:
                return this.handleStream(signal);
        }
    }

    private async handleStream(signal: Signal): Promise<void> {
        const {
            value,
        } = signal;
        const request = streamRequestSchema.parse(value) as StreamRequest;
        const {
            stream,
        } = request;
        try {
            for await (const entry of stream) {
                this.renderArea(entry, request);
            }
        }
        catch (error) {
            this.emitError(error, request);
        }
    }

    private renderArea(entry: Record<string, unknown>, streamRequest: StreamRequest): void {
        const [area] = Object.values(streamEntrySchema.parse(entry));
        const request = this.createAreaRequest(area as Area, streamRequest);
        this.renderSkeleton(request);
        this.pulse(SignalType.AREA_RENDERED, request);
    }

    private createAreaRequest(area: Area, streamRequest: StreamRequest): Request {
        const {
            correlationId,
            targetAreaId,
            context,
        } = streamRequest;
        const {
            id: areaId,
            name,
            dimensions,
            qualities,
            design,
        } = area;
        return requestSchema.parse({
            correlationId,
            targetAreaId,
            areaId,
            parentTo: targetAreaId,
            name,
            dimensions,
            qualities,
            design,
            context: {
                area,
                request: context,
            },
        });
    }

    private renderSkeleton(request: Request): void {
        const {
            areaId,
            parentTo,
            name,
            dimensions,
            qualities,
            design,
        } = request;
        const {
            aim,
        } = this.disposition;
        const {
            skeleton,
        } = aim.body ?? {};
        this.pulse(SkeletonSignalType.RENDER, {
            areaId,
            parentTo,
            name,
            dimensions,
            areaQualities: {
                ...dimensions,
                ...qualities,
                ...design,
            },
        }, skeleton);
    }

    private emitError(error: unknown, request: StreamRequest): void {
        const {
            correlationId,
            targetAreaId,
            context,
        } = request;
        this.pulse(SignalType.ERROR, {
            correlationId,
            areaId: targetAreaId,
            error: error instanceof Error ? error.message : String(error),
            context,
        });
    }
}

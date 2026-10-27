import { Presentation } from '@uca/capability-presentation';
import { WebComponent } from '@uca/capability-web-component';
import { Css } from '@uca/capability-css';
import { Zod } from '@uca/capability-zod';
import type { Aim, Declaration, Disposition } from '@uca/core/types';
import type { StyledBody } from './types.js';
import type { Kind } from '@uca/capability-presentation/types';
import type { z } from 'zod';

function identifiedAim(aim: Aim, body: object): Aim {
    return {
        ...aim,
        body,
    };
}

function identifiedDisposition(disposition: Disposition, body: object): Disposition {
    const {
        aim,
    } = disposition;
    return {
        ...disposition,
        aim: identifiedAim(aim, body),
    };
}

export function presentationDeclaration(id: string, kind: Kind): Declaration {
    return [
        Presentation,
        identifiedDisposition(Presentation.disposition, {
            id: `${id}:presentation`,
            kind,
        }),
    ];
}

export function webComponentDeclaration(id: string): Declaration {
    return [
        WebComponent,
        identifiedDisposition(WebComponent.disposition, {
            id: `${id}:web-component`,
        }),
    ];
}

export function cssDeclaration(id: string): Declaration {
    return [
        Css,
        identifiedDisposition(Css.disposition, {
            id: `${id}:css`,
        }),
    ];
}

export function stylePayload(body: StyledBody): object {
    const {
        elementId,
        qualities,
    } = body;
    return {
        elementId,
        qualities,
    };
}

export function zodDeclaration(id: string, schema?: z.ZodType): Declaration {
    return [
        Zod,
        identifiedDisposition(Zod.disposition, {
            id: `${id}:zod`,
            ...(schema && { schema }),
        }),
    ];
}

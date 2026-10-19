import { Schema } from '@uca/capability-schema';
import { Presentation } from '@uca/capability-presentation';
import { Css } from '@uca/capability-css';
import type { Aim, Declaration, Disposition } from '@uca/core/types';
import type { StyledBody } from './types.js';
import type { Kind } from '@uca/capability-presentation/types';

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

export function schemaDeclaration(id: string): Declaration {
    return [
        Schema,
        identifiedDisposition(Schema.disposition, {
            id: `${id}:schema`,
        }),
    ];
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

import {assertNever} from '@age-online/lib-core';


export enum DisplayControls {
    HIDDEN = 'hidden',
    VISIBLE = 'visible',
    VISIBLE_OVERLAY = 'visible-overlay',
}


const displayControlsValues = new Set<string>(Object.values(DisplayControls));

export function isDisplayControls(value: unknown): value is DisplayControls {
    return typeof value === 'string' && displayControlsValues.has(value);
}


export function cycleDisplayControls(displayControls: DisplayControls): DisplayControls {
    switch (displayControls) {

        case DisplayControls.HIDDEN:
            return DisplayControls.VISIBLE;

        case DisplayControls.VISIBLE_OVERLAY:
            return DisplayControls.HIDDEN;

        case DisplayControls.VISIBLE:
            return DisplayControls.VISIBLE_OVERLAY;

        default:
            return assertNever(displayControls);
    }
}

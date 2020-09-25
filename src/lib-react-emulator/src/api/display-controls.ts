export enum DisplayControls {
    HIDDEN = 'hidden',
    VISIBLE = 'visible',
    VISIBLE_OVERLAY = 'visible-overlay',
}


const displayControlsValues = new Set<string>(Object.values(DisplayControls));

export function isDisplayControls(value: unknown): value is DisplayControls {
    return typeof value === 'string' && displayControlsValues.has(value);
}

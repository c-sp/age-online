import {assertNever} from '@age-online/lib-common';


export enum EmulatorControls {
    HIDDEN = 'hidden',
    VISIBLE = 'visible',
    VISIBLE_OVERLAY = 'visible-overlay',
}


const emulatorControlsValues = new Set<string>(Object.values(EmulatorControls));

export function isEmulatorControls(value: unknown): value is EmulatorControls {
    return typeof value === 'string' && emulatorControlsValues.has(value);
}


export function nextEmulatorControls(emulatorControls: EmulatorControls): EmulatorControls {
    switch (emulatorControls) {

        case EmulatorControls.HIDDEN:
            return EmulatorControls.VISIBLE;

        case EmulatorControls.VISIBLE:
            return EmulatorControls.VISIBLE_OVERLAY;

        case EmulatorControls.VISIBLE_OVERLAY:
            return EmulatorControls.HIDDEN;

        default:
            return assertNever(emulatorControls);
    }
}

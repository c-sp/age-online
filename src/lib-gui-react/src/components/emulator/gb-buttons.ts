import {GameboyButton} from "@age-online/lib-emulator";
import {assertNever} from "@age-online/lib-common";


export interface IGbButtons {
    gbRight: boolean;
    gbDown: boolean;
    gbLeft: boolean;
    gbUp: boolean;
    gbB: boolean;
    gbA: boolean;
    gbSelect: boolean;
    gbStart: boolean;
}


export function gbButton(key: keyof IGbButtons): GameboyButton {
    switch (key) {
        case 'gbRight':
            return GameboyButton.GB_BUTTON_RIGHT;

        case 'gbDown':
            return GameboyButton.GB_BUTTON_DOWN;

        case 'gbLeft':
            return GameboyButton.GB_BUTTON_LEFT;

        case 'gbUp':
            return GameboyButton.GB_BUTTON_UP;

        case 'gbB':
            return GameboyButton.GB_BUTTON_B;

        case 'gbA':
            return GameboyButton.GB_BUTTON_A;

        case 'gbSelect':
            return GameboyButton.GB_BUTTON_SELECT;

        case 'gbStart':
            return GameboyButton.GB_BUTTON_START;

        default:
            return assertNever(key);
    }
}

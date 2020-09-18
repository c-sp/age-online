import {GameboyButton} from '@age-online/lib-emulator';
import {assertNever} from '@age-online/lib-common';


export interface IButtonsDown {
    gbRight: boolean;
    gbDown: boolean;
    gbLeft: boolean;
    gbUp: boolean;
    gbB: boolean;
    gbA: boolean;
    gbSelect: boolean;
    gbStart: boolean;
}

export function noButtonsDown(): IButtonsDown {
    return {
        gbRight: false,
        gbDown: false,
        gbLeft: false,
        gbUp: false,
        gbB: false,
        gbA: false,
        gbSelect: false,
        gbStart: false,
    };
}


export function gameboyButton(key: keyof IButtonsDown): GameboyButton {
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

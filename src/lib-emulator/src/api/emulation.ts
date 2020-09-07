import {IGameboyRom} from './rom-file';


export enum GameboyButton {
    GB_BUTTON_RIGHT = 0x01,
    GB_BUTTON_LEFT = 0x02,
    GB_BUTTON_UP = 0x04,
    GB_BUTTON_DOWN = 0x08,
    GB_BUTTON_A = 0x10,
    GB_BUTTON_B = 0x20,
    GB_BUTTON_SELECT = 0x40,
    GB_BUTTON_START = 0x80,
}


export interface IEmulation {

    readonly romFile: IGameboyRom;

    /**
     * Initialize emulation output:
     *  - prepare audio output
     *  - prepare video output for on the specified {@link HTMLCanvasElement}
     */
    initializeOutput(canvas: HTMLCanvasElement): void;

    /**
     * Run the emulation for the specified number of milliseconds.
     *
     * If {@link initializeOutput} has not been called yet,
     * the emulation will run but skip any output.
     */
    runEmulation(msToEmulate: number, audioSampleRate: number): boolean;

    buttonDown(button: GameboyButton): void;

    buttonUp(button: GameboyButton): void;

    // TODO get video buffer

    // TODO get audio buffer
}

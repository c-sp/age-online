import {IGameboyCartridge} from '../../gameboy-cartridge';


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

    getCartridge(): IGameboyCartridge;


    startEmulation(canvas: HTMLCanvasElement): void;

    isEmulationPaused(): boolean;

    pauseEmulation(pauseEmulation: boolean): Promise<void>;

    stopEmulation(): void;


    buttonDown(button: GameboyButton): void;

    buttonUp(button: GameboyButton): void;
}

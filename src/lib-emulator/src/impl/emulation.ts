import {GameboyButton, IEmulation, IGameboyRom} from '../api';
import {IWasmInstance} from './wasm-instance';


export class Emulation implements IEmulation {

    private readonly cyclesPerSecond: number;
    private emulatedMillis = 0;

    constructor(private readonly wasmInstance: IWasmInstance,
                readonly romFile: IGameboyRom) {

        const romArray = new Uint8Array(romFile.romData);
        const bufferPtr = wasmInstance._gb_allocate_rom_buffer(romArray.length);
        wasmInstance.HEAPU8.set(romArray, bufferPtr);
        wasmInstance._gb_new_emulator();

        this.cyclesPerSecond = wasmInstance._gb_get_cycles_per_second();
    }

    initializeOutput(_canvas: HTMLCanvasElement): void {
    }

    buttonDown(button: GameboyButton): void {
        this.wasmInstance._gb_set_buttons_down(button);
    }

    buttonUp(button: GameboyButton): void {
        this.wasmInstance._gb_set_buttons_up(button);
    }

    runEmulation(msToEmulate: number, audioSampleRate: number): boolean {
        const {cyclesPerSecond, emulatedMillis, wasmInstance} = this;

        const msLimit = emulatedMillis + msToEmulate;
        this.emulatedMillis = msLimit;

        const cycleLimit = Math.floor(msLimit * cyclesPerSecond / 1000);
        const cycleDiff = cycleLimit - wasmInstance._gb_get_emulated_cycles();

        return (cycleDiff > 0) && wasmInstance._gb_emulate(cycleDiff, audioSampleRate);
    }
}

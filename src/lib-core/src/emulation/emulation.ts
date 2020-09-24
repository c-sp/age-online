import {Renderer} from './renderer';
import {IWasmInstance} from './wasm-instance';
import {GameboyButton, IEmulation} from './api';
import {IGameboyCartridge} from '../gameboy-cartridge';


export class Emulation implements IEmulation {

    pauseEmulation = false;

    private readonly cyclesPerSecond: number;

    private renderer?: Renderer;
    private animationRequestHandle?: number;
    private lastTimestamp?: number;
    private emulatedMillis = 0;

    constructor(private readonly wasmInstance: IWasmInstance,
                readonly cartridge: IGameboyCartridge) {

        const romArray = new Uint8Array(cartridge.romData);
        const bufferPtr = wasmInstance._gb_allocate_rom_buffer(romArray.length);
        wasmInstance.HEAPU8.set(romArray, bufferPtr);
        wasmInstance._gb_new_emulator();

        this.cyclesPerSecond = wasmInstance._gb_get_cycles_per_second();
    }


    startEmulation(canvas: HTMLCanvasElement): void {
        this.stopEmulation();

        this.renderer = new Renderer(canvas);
        this.requestAnimationFrame();
    }

    stopEmulation(): void {
        const {animationRequestHandle} = this;
        if (animationRequestHandle) { // the handle is non-zero
            cancelAnimationFrame(animationRequestHandle);

            this.renderer = undefined;
            this.animationRequestHandle = undefined;
            this.lastTimestamp = undefined;
        }
    }

    private requestAnimationFrame(): void {
        this.animationRequestHandle = requestAnimationFrame(timestamp => this.runEmulation(timestamp));
    }

    private runEmulation(timestamp: number): void {
        const {pauseEmulation, lastTimestamp, cyclesPerSecond, wasmInstance, renderer} = this;

        if (lastTimestamp && !pauseEmulation) {
            // we assume at least 30 fps, anything less will throttle the emulation
            // (this will also handle the tab becoming active again,
            // if the browser stops handling animation-frame-requests during tab inactivity)
            const millisElapsed = Math.min(33, timestamp - lastTimestamp);
            const millis = this.emulatedMillis += millisElapsed;

            const cycles = Math.floor(millis * cyclesPerSecond / 1000);
            const cyclesToEmulate = cycles - wasmInstance._gb_get_emulated_cycles();

            if (cyclesToEmulate > 0) {
                const newFrame = wasmInstance._gb_emulate(cyclesToEmulate, 48000);
                if (newFrame) {
                    const bufferOfs = wasmInstance._gb_get_screen_front_buffer();
                    const screenBytes = new Uint8ClampedArray(wasmInstance.HEAPU8.buffer, bufferOfs, 160 * 144 * 4);
                    renderer?.newFrame(screenBytes);
                }
            }
        }

        this.lastTimestamp = timestamp;
        this.requestAnimationFrame();
    }


    buttonDown(button: GameboyButton): void {
        this.wasmInstance._gb_set_buttons_down(button);
    }

    buttonUp(button: GameboyButton): void {
        this.wasmInstance._gb_set_buttons_up(button);
    }
}

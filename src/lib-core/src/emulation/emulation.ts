import {Renderer} from './renderer';
import {IWasmInstance} from './wasm-instance';
import {GameboyButton, IEmulation} from './api';
import {IGameboyCartridge} from '../gameboy-cartridge';
import {AudioStreamer} from './audio';


export class Emulation implements IEmulation {

    pauseEmulation = false;

    private readonly cyclesPerSecond: number;

    private renderer?: Renderer;
    private audioStreamer?: AudioStreamer;
    private animationRequestHandle?: number;
    private lastTimestamp?: number;
    private emulatedMillis = 0;

    constructor(private readonly wasmInstance: IWasmInstance,
                private readonly cartridge: IGameboyCartridge,
                private readonly ageAudioWorkletUrl: string) {

        const {romData, ramData} = cartridge;
        const bufferPtr = wasmInstance._gb_allocate_rom_buffer(romData.length);
        wasmInstance.HEAPU8.set(romData, bufferPtr);
        wasmInstance._gb_new_emulator();

        const gbRamSize = wasmInstance._gb_get_persistent_ram_size();
        if (ramData && gbRamSize) {
            const ramOffset = wasmInstance._gb_get_persistent_ram();
            const ram = gbRamSize >= ramData.length ? ramData : ramData.subarray(0, gbRamSize);
            wasmInstance.HEAPU8.set(ram, ramOffset);
            wasmInstance._gb_set_persistent_ram();
        }

        this.cyclesPerSecond = wasmInstance._gb_get_cycles_per_second();
    }


    getCartridge(): IGameboyCartridge {
        const {cartridge} = this;
        const ramData = this.readPersistentRam();
        return ramData ? {...cartridge, ramData} : cartridge;
    }

    private readPersistentRam(): Uint8Array | null {
        const {wasmInstance} = this;

        const ramSize = wasmInstance._gb_get_persistent_ram_size();
        if (ramSize < 1) {
            return null;
        }

        const ramPtr = wasmInstance._gb_get_persistent_ram();
        return wasmInstance.HEAPU8.subarray(ramPtr, ramPtr + ramSize);
    }


    startEmulation(canvas: HTMLCanvasElement): void {
        this.stopEmulation();

        this.renderer = new Renderer(canvas);
        this.audioStreamer = new AudioStreamer(this.ageAudioWorkletUrl);
        this.requestAnimationFrame();
    }

    stopEmulation(): void {
        const {animationRequestHandle} = this;
        if (animationRequestHandle) { // the handle is non-zero
            cancelAnimationFrame(animationRequestHandle);

            this.audioStreamer?.close();

            this.renderer = undefined;
            this.audioStreamer = undefined;
            this.animationRequestHandle = undefined;
            this.lastTimestamp = undefined;
        }
    }

    private requestAnimationFrame(): void {
        this.animationRequestHandle = requestAnimationFrame(timestamp => this.runEmulation(timestamp));
    }

    private runEmulation(timestamp: number): void {
        const {pauseEmulation, lastTimestamp, cyclesPerSecond, wasmInstance, renderer, audioStreamer} = this;

        if (lastTimestamp && !pauseEmulation) {
            // we assume at least 30 fps, anything less will throttle the emulation
            // (this will also handle the tab becoming active again,
            // if the browser stops handling animation-frame-requests during tab inactivity)
            const millisElapsed = Math.min(33, timestamp - lastTimestamp);
            const millis = this.emulatedMillis += millisElapsed;

            const cycles = Math.floor(millis * cyclesPerSecond / 1000);
            const cyclesToEmulate = cycles - wasmInstance._gb_get_emulated_cycles();

            if (cyclesToEmulate > 0) {
                const newFrame = wasmInstance._gb_emulate(cyclesToEmulate, audioStreamer?.sampleRate ?? 48000);

                const audioBufferOffset = wasmInstance._gb_get_audio_buffer();
                const audioBufferEnd = audioBufferOffset + (wasmInstance._gb_get_audio_buffer_size() * 4);
                const audioBuffer = wasmInstance.HEAP16.slice(audioBufferOffset / 2, audioBufferEnd / 2);
                audioStreamer?.stream(audioBuffer);

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

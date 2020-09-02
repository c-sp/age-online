import {IEmulation} from '../api';
import {IWasmInstance} from './wasm-instance';


export class Emulation implements IEmulation {

    constructor(_wasmInstance: IWasmInstance) {
    }

    initializeOutput(_canvas: HTMLCanvasElement): void {
    }

    runEmulation(_msToEmulate: number): void {
    }
}

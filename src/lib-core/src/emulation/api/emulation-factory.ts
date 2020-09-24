import {IEmulation} from './emulation';
import {Observable} from 'rxjs';
import {ErrorWithCause} from '../../utilities';
import {TGameboyRomSource} from '../../gameboy-cartridge';


export class WasmFetchError extends ErrorWithCause {

    constructor(cause?: Error) {
        super('fetching WebAssembly files failed', cause);
    }
}

export class WasmInitError extends ErrorWithCause {

    constructor(cause?: Error) {
        super('WebAssembly initialization error', cause);
    }
}


export interface IEmulationFactory {

    newEmulation$(romSource: TGameboyRomSource): Observable<IEmulation>;
}

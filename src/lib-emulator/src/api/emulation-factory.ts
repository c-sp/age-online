import {ErrorWithCause} from '@age-online/lib-common';
import {IEmulation} from './emulation';
import {Observable} from 'rxjs';
import {TGameboyRomSource} from './rom-file';


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

export class RomFileLoadingError extends ErrorWithCause {

    constructor(cause?: Error) {
        super('rom file loading error', cause);
    }
}

export class InvalidRomFileError extends ErrorWithCause {

    constructor(cause?: Error) {
        super('no valid rom file', cause);
    }
}


export interface IEmulationFactory {

    newEmulation$(romFile: TGameboyRomSource): Observable<IEmulation>;
}

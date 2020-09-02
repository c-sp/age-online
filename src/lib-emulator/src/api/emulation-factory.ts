import {ErrorWithCause} from '@age-online/lib-common';
import {IEmulation} from './emulation';
import {Observable} from 'rxjs';
import {TRomFile} from './rom-file';


export class AgeWasmFetchError extends ErrorWithCause {

    constructor(cause?: Error) {
        super('fetching WebAssembly files failed', cause);
    }
}

export class AgeWasmInitError extends ErrorWithCause {

    constructor(cause?: Error) {
        super('WebAssembly initialization error', cause);
    }
}


export interface IEmulationFactory {

    newEmulation$(romFile: TRomFile): Observable<IEmulation>;
}

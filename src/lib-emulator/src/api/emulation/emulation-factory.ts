import {ErrorWithCause} from '@age-online/lib-common';
import {IEmulation} from './emulation';
import {Observable} from 'rxjs';
import {TGameboyRomSource} from '../rom';


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

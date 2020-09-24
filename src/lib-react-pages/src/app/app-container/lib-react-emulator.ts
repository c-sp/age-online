import {ErrorWithCause, IEmulationFactory, IRomArchive} from '@age-online/lib-core';
import {from, Observable, of} from 'rxjs';
import {map, shareReplay, switchMap} from 'rxjs/operators';


export class ErrorLoadingLibReactEmulator extends ErrorWithCause {

    constructor(cause?: Error) {
        super('error loading lib-react-emulator', cause);
    }
}

type TLibEmulator = typeof import('@age-online/lib-react-emulator');

async function importLibEmulator(): Promise<TLibEmulator> {
    try {
        return await import('@age-online/lib-react-emulator');

    } catch (err) {
        throw new ErrorLoadingLibReactEmulator(err);
    }
}

function importLibEmulator$(): Observable<TLibEmulator> {
    return of({}).pipe(
        switchMap(() => from(importLibEmulator())),
        // dynamic imports are already cached so there is no need for
        // shareReplay() or similar
    );
}


export function newEmulationFactory$(ageWasmJsUrl: string,
                                     ageWasmUrl: string): Observable<IEmulationFactory> {

    return importLibEmulator$().pipe(
        map(lib => lib.createEmulationFactory(ageWasmJsUrl, ageWasmUrl)),
        // create the IEmulationFactory only once for this observable
        shareReplay(1),
    );
}

export function newRomArchive$(archiveName: string): Observable<IRomArchive> {
    return importLibEmulator$().pipe(
        map(lib => lib.createRomArchive(archiveName)),
        // create the IRomArchive only once for this observable
        shareReplay(1),
    );
}

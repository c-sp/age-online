import {ErrorWithCause} from '@age-online/lib-common';
import {from, Observable, of} from 'rxjs';
import {IEmulationFactory, IRomArchive} from '@age-online/lib-emulator';
import {map, shareReplay, switchMap} from 'rxjs/operators';


export class ErrorLoadingLibEmulator extends ErrorWithCause {

    constructor(cause?: Error) {
        super('error loading lib-emulator', cause);
    }
}

type TLibEmulator = typeof import('@age-online/lib-emulator');

async function importLibEmulator(): Promise<TLibEmulator> {
    try {
        return await import('@age-online/lib-emulator');

    } catch (err) {
        throw new ErrorLoadingLibEmulator(err);
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
        map(lib => lib.newEmulationFactory(ageWasmJsUrl, ageWasmUrl)),
        // create the IEmulationFactory only once for this observable
        shareReplay(1),
    );
}

export function newRomArchive$(archiveName: string): Observable<IRomArchive> {
    return importLibEmulator$().pipe(
        map(lib => lib.newRomArchive(archiveName)),
        // create the IRomArchive only once for this observable
        shareReplay(1),
    );
}

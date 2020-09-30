import {Observable} from 'rxjs';
import {openDatabase$} from './open-database';
import {map, shareReplay} from 'rxjs/operators';
import {IArchivedRom, IRomArchive} from './api';


class RomArchive implements IRomArchive {

    private readonly indexedDB$: Observable<IDBDatabase>;

    constructor(archiveName: string) {
        this.indexedDB$ = openDatabase$(archiveName).pipe(shareReplay(1));
    }

    readRomList$(): Observable<IArchivedRom[]> {
        return this.indexedDB$.pipe(map(() => []));
    }

    readRomData$(): Observable<Uint8Array | null> {
        return this.indexedDB$.pipe(map(() => null));
    }

    readRamData$(): Observable<Uint8Array | null> {
        return this.indexedDB$.pipe(map(() => null));
    }

    writeRamData$(): Observable<unknown> {
        return this.indexedDB$.pipe(map(() => null));
    }
}


export function newRomArchive(archiveName: string): IRomArchive {
    return new RomArchive(archiveName);
}

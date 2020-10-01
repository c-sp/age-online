import {Observable} from 'rxjs';
import {openDatabase$, RAM_DATA_STORE} from './open-database';
import {map, shareReplay, switchMap} from 'rxjs/operators';
import {IArchivedRamData, IArchivedRom, IRomArchive} from './api';
import {txWrite$} from './tx-write';
import {txRead$} from './tx-read';


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

    readRamData$(romHashMD5: string): Observable<Uint8Array | null> {
        return this.indexedDB$.pipe(
            switchMap(db => txRead$<IArchivedRamData>(db, RAM_DATA_STORE, romHashMD5)),
            map(v => v?.ramData ?? null),
        );
    }

    writeRamData$(romHashMD5: string, ramData: Uint8Array): Observable<unknown> {
        const archiveRamData: IArchivedRamData = {romHashMD5, ramData};

        return this.indexedDB$.pipe(
            switchMap(db => txWrite$(db, RAM_DATA_STORE, archiveRamData)),
        );
    }
}


export function newRomArchive(archiveName: string): IRomArchive {
    return new RomArchive(archiveName);
}

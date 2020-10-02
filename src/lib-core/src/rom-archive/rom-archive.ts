import {from, Observable} from 'rxjs';
import {openDatabase$} from './open-database';
import {map, shareReplay, switchMap} from 'rxjs/operators';
import {IArchivedRom, IRomArchive} from './api';
import {IDbRomArchiveV2} from './db-schema';
import {IDBPDatabase} from 'idb';


async function readRam(db: IDBPDatabase<IDbRomArchiveV2>,
                       romHashMD5: string): Promise<Uint8Array | undefined> {

    const result = await db
        .transaction<'age-online-ram-data'>('age-online-ram-data', 'readonly')
        .objectStore('age-online-ram-data')
        .get(romHashMD5);

    return result?.ramData;
}


async function writeRam(db: IDBPDatabase<IDbRomArchiveV2>,
                        romHashMD5: IDbRomArchiveV2['age-online-ram-data']['value']): Promise<void> {
    await db
        .transaction<'age-online-ram-data'>('age-online-ram-data', 'readwrite')
        .objectStore('age-online-ram-data')
        .put(romHashMD5);
}


class RomArchive implements IRomArchive {

    private readonly indexedDB$: Observable<IDBPDatabase<IDbRomArchiveV2>>;

    constructor(archiveName: string) {
        this.indexedDB$ = openDatabase$(archiveName).pipe(
            // share this database with multiple subscribers and close it
            // when everyone has unsubscribed
            shareReplay({bufferSize: 1, refCount: true}),
        );
    }

    readRomList$(): Observable<IArchivedRom[]> {
        return this.indexedDB$.pipe(map(() => []));
    }

    readRomData$(): Observable<Uint8Array | undefined> {
        return this.indexedDB$.pipe(map(() => undefined));
    }

    readRamData$(romHashMD5: string): Observable<Uint8Array | undefined> {
        return this.indexedDB$.pipe(
            switchMap(db => from(readRam(db, romHashMD5))),
        );
    }

    writeRamData$(romHashMD5: string, ramData: Uint8Array): Observable<unknown> {
        return this.indexedDB$.pipe(
            switchMap(db => from(writeRam(db, {romHashMD5, ramData}))),
        );
    }
}


export function newRomArchive(archiveName: string): IRomArchive {
    return new RomArchive(archiveName);
}

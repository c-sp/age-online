import {IArchivedRom, IArchivedRomTitle, IRomArchive} from '../../api';
import {Observable} from 'rxjs';
import {openDatabase$} from './open-database';
import {map, shareReplay} from 'rxjs/operators';


export class RomArchive implements IRomArchive {

    private readonly indexedDB$: Observable<IDBDatabase>;

    constructor(readonly archiveName: string) {
        this.indexedDB$ = openDatabase$(archiveName).pipe(shareReplay(1));
    }

    readRomList$(): Observable<IArchivedRomTitle[]> {
        return this.indexedDB$.pipe(map(() => []));
    }

    readRom$(): Observable<IArchivedRom | null> {
        return this.indexedDB$.pipe(map(() => null));
    }

    addRom$(): Observable<IArchivedRom> {
        return this.indexedDB$.pipe(map(() => {
            throw new Error('addRom$ not implemented');
        }));
    }

    updateRomTitle$(): Observable<IArchivedRom | null> {
        return this.indexedDB$.pipe(map(() => null));
    }
}

import {IArchivedRom} from './archived-rom';
import {Observable} from 'rxjs';


export interface IRomArchive {

    readRomList$(): Observable<IArchivedRom[]>;

    readRomData$(romHashMD5: string): Observable<Uint8Array | null>;

    readRamData$(romHashMD5: string): Observable<Uint8Array | null>;

    writeRamData$(romHashMD5: string, ramData: Uint8Array): Observable<unknown>;
}


/**
 * The IndexedDB connection could not be opened.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IDBOpenDBRequest
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IDBRequest/onerror
 */
export class IndexedDBOpenError extends Error {

    constructor(readonly domException: DOMException | null) {
        super('could not open IndexedDB');
    }
}

/**
 * The IndexedDB is blocked by another instance even after the `versionchange`
 * event has been sent.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IDBOpenDBRequest/onblocked
 */
export class IndexedDBBlockedError extends Error {

    constructor() {
        super('IndexedDB blocked by different instance');
    }
}

/**
 * The IndexedDB connection has been closed because an error occurred that was
 * not handled by the respective request/transaction.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase/onerror
 */
export class IndexedDBError extends Error {

    constructor() {
        super('IndexedDB error');
    }
}

/**
 * The IndexedDB connection has been closed to allow handling a database version
 * change triggered by another instance
 * (e.g. in another window or tab).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase/onversionchange
 */
export class IndexedDBVersionChangeError extends Error {

    constructor() {
        super('IndexedDB version changed by different instance');
    }
}

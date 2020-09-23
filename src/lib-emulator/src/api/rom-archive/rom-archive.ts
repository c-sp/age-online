import {IArchivedRom, IArchivedRomTitle} from './archived-rom';
import {Observable} from 'rxjs';


export interface IRomArchive {

    readRomList$(): Observable<IArchivedRomTitle[]>;

    readRom$(romHash: string): Observable<IArchivedRom | null>;

    addRom$(romData: Uint8Array, ramData: Uint8Array | null): Observable<IArchivedRom>;

    updateRomTitle$(romHash: string, customTitle: string): Observable<IArchivedRom | null>;
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

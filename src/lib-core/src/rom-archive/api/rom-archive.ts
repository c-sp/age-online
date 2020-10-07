import {Observable} from 'rxjs';
import {ErrorWithCause} from '../../utilities';


export interface IArchivedRom {
    readonly romHashMD5: string;
    readonly romCustomTitle?: string;
    readonly romInternalTitle: string;
    readonly addedOn: Date;
}

export interface IRomArchive {

    readRomList$(): Observable<IArchivedRom[]>;

    readRomData$(romHashMD5: string): Observable<Uint8Array | undefined>;

    readRamData$(romHashMD5: string): Observable<Uint8Array | undefined>;

    writeRamData$(romHashMD5: string, ramData: Uint8Array): Observable<void>;
}


/**
 * The IndexedDB connection could not be opened.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IDBOpenDBRequest
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IDBRequest/onerror
 */
export class IndexedDBOpenError extends ErrorWithCause {

    constructor(reason?: unknown) {
        super('could not open IndexedDB', reason);
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
 * The IndexedDB connection has been unexpectedly closed.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase/onclose
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

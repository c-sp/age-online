import {Observable} from 'rxjs';
import {
    archivedRomPrimaryKey,
    IndexedDBBlockedError,
    IndexedDBError,
    IndexedDBOpenError,
    IndexedDBVersionChangeError,
} from './api';


export const ROM_INFO_STORE = 'age-online-rom-info';
export const ROM_DATA_STORE = 'age-online-rom-data';
export const RAM_DATA_STORE = 'age-online-ram-data';


export function openDatabase$(dbName: string): Observable<IDBDatabase> {
    return new Observable<IDBDatabase>(subscriber => {

        const request = indexedDB.open(dbName, 1);
        request.onerror = () => subscriber.error(new IndexedDBOpenError(request.error));
        request.onblocked = () => subscriber.error(new IndexedDBBlockedError());

        // IndexedDB open
        request.onsuccess = () => {
            const {result} = request;
            subscriber.next(result);

            result.onerror = () => {
                result.close();
                subscriber.error(new IndexedDBError());
            };

            result.onversionchange = () => {
                result.close();
                subscriber.error(new IndexedDBVersionChangeError());
            };
        };

        // upgrade old IndexedDB
        request.onupgradeneeded = ev => {
            const {oldVersion} = ev;
            const {result: db} = request;

            if (oldVersion <= 2) {
                db.createObjectStore(ROM_INFO_STORE, {keyPath: archivedRomPrimaryKey});
                db.createObjectStore(ROM_DATA_STORE, {keyPath: archivedRomPrimaryKey});
                db.createObjectStore(RAM_DATA_STORE, {keyPath: archivedRomPrimaryKey});
            }
        };
    });
}

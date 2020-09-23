import {Observable} from 'rxjs';
import {
    archivedRomCustomTitleKey,
    archivedRomInternalTitleKey,
    archivedRomPrimaryKey,
    IndexedDBBlockedError,
    IndexedDBError,
    IndexedDBOpenError,
    IndexedDBVersionChangeError,
} from '../../api';


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
            const {result} = request;

            if (oldVersion <= 1) {
                const store = result.createObjectStore('rom-archive', {keyPath: archivedRomPrimaryKey});
                store.createIndex(`${archivedRomCustomTitleKey}Idx`, archivedRomCustomTitleKey);
                store.createIndex(`${archivedRomInternalTitleKey}Idx`, archivedRomInternalTitleKey);
            }
        };
    });
}

import {Observable} from 'rxjs';


export function txRead$<T>(database: IDBDatabase,
                           objectStore: string,
                           primaryKey: string): Observable<T> {

    return new Observable<T>(subscriber => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const request: IDBRequest<T> = database
            .transaction([objectStore], 'readonly')
            .objectStore(objectStore)
            .get(primaryKey);

        request.onsuccess = () => {
            subscriber.next(request.result);
            subscriber.complete();
        };

        request.onerror = () => subscriber.error(); // TODO new error instance
    });
}

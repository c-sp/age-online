import {Observable} from 'rxjs';


export function txWrite$<T>(database: IDBDatabase,
                            objectStore: string,
                            data: T): Observable<T> {

    return new Observable<T>(subscriber => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const request = database
            .transaction([objectStore], 'readwrite')
            .objectStore(objectStore)
            .put(data);

        request.onsuccess = () => {
            subscriber.next(data);
            subscriber.complete();
        };

        request.onerror = () => subscriber.error(); // TODO new error instance
    });
}

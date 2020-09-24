import {Observable} from 'rxjs';


/**
 * read the specified {@link Blob} as {@link ArrayBuffer}
 */
export function readBlob$(blob: Blob): Observable<ArrayBuffer> {
    // We use a FileReader as Blob.arrayBuffer() is not supported by Safari:
    // https://caniuse.com/#search=blob%20arraybuffer

    return new Observable(subscriber => {
        const fileReader = new FileReader();

        fileReader.onerror = err => subscriber.error(err);
        fileReader.onabort = err => subscriber.error(err);

        fileReader.onload = () => {
            subscriber.next(fileReader.result as ArrayBuffer);
            subscriber.complete();
        };
        fileReader.readAsArrayBuffer(blob);

        // teardown logic (unsubscriber):
        // abort ongoing file reading
        return () => {
            if (fileReader.readyState === FileReader.LOADING) {
                fileReader.onabort = null;
                fileReader.abort();
            }
        };
    });
}

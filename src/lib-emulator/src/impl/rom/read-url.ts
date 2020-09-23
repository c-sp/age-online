import {Observable} from 'rxjs';


export function readUrl$(url: string): Observable<ArrayBuffer> {
    throw new Error(`${url}: URL loading not implemented yet`);
}

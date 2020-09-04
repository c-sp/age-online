import {Observable} from 'rxjs';
import {TRomFile} from '../../api';
import {readBlob$} from './read-blob';


export function readRomFile$({localFile}: TRomFile): Observable<ArrayBuffer> {
    if (localFile) {
        return readBlob$(localFile);
    }
    throw new Error('URL loading not implemented yet');
}

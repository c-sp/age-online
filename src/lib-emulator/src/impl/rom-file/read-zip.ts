import JSZip from 'jszip';
import {from, Observable} from 'rxjs';
import {NoZippedRomFoundError} from '../../api';


export function extractRomFromZip$(file: ArrayBuffer): Observable<ArrayBuffer> {
    return from(extractRomFromZip(file));
}


async function extractRomFromZip(file: ArrayBuffer): Promise<ArrayBuffer> {
    const jsZip = await openZipArchive(file);

    // if this is no valid zip file, just continue using it
    if (!jsZip) {
        return file;
    }

    // get a list of all rom files within that archive
    const files = jsZip.file(/.*(\.gb)|(\.gbc)|(\.cgb)$/ui);
    if (!files || !files.length) {
        throw new NoZippedRomFoundError();
    }

    // for deterministic rom file loading we sort the files
    // just in case there are multiple rom files present
    files.sort((a, b) => a.name.localeCompare(b.name));

    // extract the first file
    return files[0].async('arraybuffer');
}


async function openZipArchive(archive: ArrayBuffer): Promise<JSZip | undefined> {
    try {
        return await JSZip.loadAsync(archive);

    } catch (err) {
        // this is no valid zip file
        return undefined;
    }
}

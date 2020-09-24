import {Observable} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {ErrorWithCause} from '../utilities';
import {IGameboyCartridge, TGameboyRomSource} from './api';
import {readBlob$} from './read-blob';
import {readUrl$} from './read-url';
import {extractGameboyRomFromZip$} from './read-zip';
import {newGameboyCartridge} from './new-gameboy-cartridge';


export class RomFileLoadingError extends ErrorWithCause {

    constructor(cause?: Error) {
        super('rom file loading error', cause);
    }
}

export function loadGameboyCartridge$(romSource: TGameboyRomSource): Observable<IGameboyCartridge> {
    const readFile$ = romSource.localFile
        ? readBlob$(romSource.localFile)
        : readUrl$(romSource.romFileUrl);

    return readFile$.pipe(
        // check if this is a zip archive and (if yes) try to extract any
        // Gameboy rom file from it
        switchMap(file => extractGameboyRomFromZip$(file)),

        // check the rom file
        map(romBuffer => newGameboyCartridge(romBuffer)),

        // wrap any unmapped error into a RomFileLoadingError
        catchError(err => {
            if (err instanceof ErrorWithCause) {
                throw err;
            }
            throw new RomFileLoadingError(err);
        }),
    );
}

import {combineLatest, from, Observable} from 'rxjs';
import {fromFetch} from 'rxjs/fetch';
import {catchError, map, shareReplay, switchMap, take} from 'rxjs/operators';
import {IEmulation, IEmulationFactory, RomFileLoadingError, TGameboyRomSource, WasmFetchError, WasmInitError} from '../api';
import {Emulation} from './emulation';
import {readRomFile$} from './rom-file';
import {IWasmInstance} from './wasm-instance';


export class EmulationFactory implements IEmulationFactory {

    private readonly ageWasmInstance$: Observable<IWasmInstance>;

    constructor(ageWasmJsUrl: string,
                ageWasmUrl: string) {

        this.ageWasmInstance$ = combineLatest([

            // load the wasm-Initializing JavaScript module (WebPack: don't bundle this!)
            from(import(/* webpackIgnore: true */ ageWasmJsUrl)).pipe(
                catchError(err => {
                    throw new WasmFetchError(err);
                }),
            ),

            // load the wasm binary
            fromFetch(ageWasmUrl).pipe(
                switchMap(response => {
                    if (response.ok) {
                        return response.arrayBuffer();
                    }
                    throw new WasmFetchError();
                }),
            ).pipe(
                catchError(err => {
                    throw new WasmFetchError(err);
                }),
            ),

        ]).pipe(
            // load the files only once
            shareReplay(1),

            // complete once loaded
            take(1),

            // initialize new wasm module
            switchMap(([wasmInit, wasmBinary]) => from(wasmInit.default({wasmBinary})).pipe(
                catchError(err => {
                    throw new WasmInitError(err);
                }),
                map(wasmInstance => {
                    if (!wasmInstance) {
                        throw new WasmInitError();
                    }
                    return wasmInstance as IWasmInstance;
                }),
            )),
        );
    }


    newEmulation$(romFile: TGameboyRomSource): Observable<IEmulation> {
        return combineLatest([
            this.ageWasmInstance$,
            readRomFile$(romFile).pipe(
                catchError(err => {
                    throw new RomFileLoadingError(err);
                }),
            ),
        ]).pipe(
            map(([wasmInstance, romFile]) => new Emulation(wasmInstance, romFile)),
        );
    }
}

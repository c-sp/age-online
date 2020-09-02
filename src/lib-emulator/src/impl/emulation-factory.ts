import {combineLatest, from, Observable} from 'rxjs';
import {fromFetch} from 'rxjs/fetch';
import {catchError, map, shareReplay, switchMap, take} from 'rxjs/operators';
import {AgeWasmFetchError, AgeWasmInitError, IEmulation, IEmulationFactory, TRomFile} from '../api';
import {Emulation} from './emulation';
import {IWasmInstance} from './wasm-instance';


export class EmulationFactory implements IEmulationFactory {

    private readonly ageWasmInstance$: Observable<IWasmInstance>;

    constructor(ageWasmJsUrl: string,
                ageWasmUrl: string) {

        this.ageWasmInstance$ = combineLatest([

            // load the wasm-Initializing JavaScript module (WebPack: don't bundle this!)
            from(import(/* webpackIgnore: true */ ageWasmJsUrl)).pipe(
                catchError(err => {
                    throw new AgeWasmFetchError(err);
                }),
            ),

            // load the wasm binary
            fromFetch(ageWasmUrl).pipe(
                switchMap(response => {
                    if (response.ok) {
                        return response.arrayBuffer();
                    }
                    throw new Error();
                }),
            ).pipe(
                catchError(err => {
                    throw new AgeWasmFetchError(err);
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
                    throw new AgeWasmInitError(err);
                }),
                map(wasmInstance => {
                    if (!wasmInstance) {
                        throw new AgeWasmInitError();
                    }
                    return wasmInstance as IWasmInstance;
                }),
            )),
        );
    }


    newEmulation$(_romFile: TRomFile): Observable<IEmulation> {
        return this.ageWasmInstance$.pipe(
            map(wasmInstance => new Emulation(wasmInstance)),
        );
    }
}

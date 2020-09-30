import {combineLatest, from, Observable} from 'rxjs';
import {fromFetch} from 'rxjs/fetch';
import {catchError, map, shareReplay, switchMap, take} from 'rxjs/operators';
import {Emulation} from './emulation';
import {IWasmInstance} from './wasm-instance';
import {IEmulation, IEmulationFactory, WasmFetchError, WasmInitError} from './api';
import {IGameboyCartridge} from '../gameboy-cartridge';


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
                        return from(response.arrayBuffer());
                    }
                    throw new WasmFetchError();
                }),
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
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


    newEmulation$(gameboyCartridge: IGameboyCartridge): Observable<IEmulation> {
        return this.ageWasmInstance$.pipe(
            map(wasmInstance => new Emulation(wasmInstance, gameboyCartridge)),
        );
    }
}

import {Observable, of} from 'rxjs';
import {
    IEmulation,
    IEmulationFactory,
    IGameboyCartridge,
    IRomArchive,
    loadGameboyCartridge$,
    TGameboyRomSource,
} from '@age-online/lib-core';
import {catchError, map, switchMap, take} from 'rxjs/operators';


export function newEmulation$(romSource: TGameboyRomSource | null,
                              oldEmulation: IEmulation | null,
                              emulationFactory: IEmulationFactory,
                              romArchive: IRomArchive): Observable<IEmulation | null> {

    const cleanupOldEmulation$ = oldEmulation
        ? saveRam$(oldEmulation)
        : of(undefined);

    const createNewEmulation$ = romSource
        ? loadCartridge$(romSource)
        : of(null);

    return cleanupOldEmulation$.pipe(
        switchMap(() => createNewEmulation$),
        // close the IndexedDB when the new emulation is ready
        take(1),
    );


    function saveRam$(emulation: IEmulation): Observable<void> {
        const {romHashMD5, ramData} = emulation.getCartridge();
        return ramData
            ? romArchive.writeRamData$(romHashMD5, ramData).pipe(
                catchError(err => {
                    // TODO display a warning to the user
                    console.warn('could not save ram', err);
                    return of(undefined);
                }),
            )
            : of(undefined);
    }

    function loadCartridge$(romSrc: TGameboyRomSource): Observable<IEmulation> {
        return loadGameboyCartridge$(romSrc).pipe(
            switchMap(loadRam$),
            switchMap(gbCart => emulationFactory.newEmulation$(gbCart)),
        );
    }

    function loadRam$(cart: IGameboyCartridge): Observable<IGameboyCartridge> {
        return cart.ramIsPersistent
            ? romArchive.readRamData$(cart.romHashMD5).pipe(
                map(
                    ramData => (ramData
                        ? {...cart, ramData}
                        : cart),
                ),
                catchError(err => {
                    // TODO display a warning to the user
                    console.warn('could not load ram', err);
                    return of(cart);
                }),
            )
            : of(cart);
    }
}

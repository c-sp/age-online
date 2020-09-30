import {Observable, of} from 'rxjs';
import {
    IEmulation,
    IEmulationFactory,
    IGameboyCartridge,
    IRomArchive,
    loadGameboyCartridge$,
    TGameboyRomSource,
} from '@age-online/lib-core';
import {TEmulatorState} from './emulator-state';
import {EmulatorState} from '../../api';
import {map, switchMap} from 'rxjs/operators';


export function newEmulation$(romSource: TGameboyRomSource | null,
                              currentEmulatorState: TEmulatorState,
                              emulationFactory: IEmulationFactory,
                              romArchive: IRomArchive): Observable<IEmulation | null> {

    const cleanupOldEmulation$ = currentEmulatorState.state === EmulatorState.EMULATOR_READY
        ? saveRam$(currentEmulatorState.emulation)
        : of(null);

    const createNewEmulation$ = romSource
        ? loadCartridge$(romSource)
        : of(null);

    return cleanupOldEmulation$.pipe(
        switchMap(() => createNewEmulation$),
    );


    function saveRam$(emulation: IEmulation): Observable<unknown> {
        const {romHashMD5, ramData} = emulation.getCartridge();
        return ramData
            ? romArchive.writeRamData$(romHashMD5, ramData)
            : of(null);
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
            )
            : of(cart);
    }
}

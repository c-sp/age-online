import {ErrorWithCause} from '@age-online/lib-common';
import {IEmulationFactory} from '@age-online/lib-emulator';
import React, {ComponentType, createContext, ReactElement} from 'react';
import {from, NEVER, Observable, of} from 'rxjs';
import {shareReplay, switchMap} from 'rxjs/operators';


export interface IEmulatorFactory$Props {
    readonly emulatorFactory$: Observable<IEmulationFactory>;
}

export const EmulatorFactory$Context = createContext<Observable<IEmulationFactory>>(NEVER);

export function withEmulatorFactory$<P>(Wrapped: ComponentType<P & IEmulatorFactory$Props>): ComponentType<P> {
    return (props: P): ReactElement => (
        <EmulatorFactory$Context.Consumer>{
            (value): ReactElement => <Wrapped emulatorFactory$={value} {...props}/>
        }</EmulatorFactory$Context.Consumer>
    );
}


export class ErrorLoadingLibEmulator extends ErrorWithCause {

    constructor(cause?: Error) {
        super('error loading lib-emulator', cause);
    }
}

async function newEmulatorFactory(ageWasmJsUrl: string,
                                  ageWasmUrl: string) {
    try {
        const libEmulator = await import('@age-online/lib-emulator');
        return libEmulator.newEmulationFactory(ageWasmJsUrl, ageWasmUrl);

    } catch (err) {
        throw new ErrorLoadingLibEmulator(err);
    }
}

export function emulationFactory$(ageWasmJsUrl: string,
                                  ageWasmUrl: string): Observable<IEmulationFactory> {

    return of({}).pipe(
        switchMap(() => from(newEmulatorFactory(ageWasmJsUrl, ageWasmUrl))),
        // one factory is enough
        // (don't create a new one for each new emulator component)
        shareReplay(1),
    );
}

import {IContentSize} from '@age-online/lib-common';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';


export interface IEmulatorState {
    readonly portrait: boolean;
}

export function emulatorState(elementSize: IContentSize): IEmulatorState {
    return {portrait: portraitOrientation(elementSize)};
}

export function emulatorState$(elementSize$: Observable<IContentSize>): Observable<IEmulatorState> {
    return elementSize$.pipe(
        map(portraitOrientation),
        distinctUntilChanged(),
        map((portrait): IEmulatorState => ({portrait})),
    );
}


function portraitOrientation({widthPx, heightPx}: IContentSize): boolean {
    const aspectRatio = (heightPx === 0) ? 0 : widthPx / heightPx;
    return aspectRatio <= (160 / 144);
}

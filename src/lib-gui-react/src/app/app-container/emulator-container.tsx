import {assertElement, IContentSize, observeSize} from '@age-online/lib-common';
import {IEmulation, newEmulationFactory} from '@age-online/lib-emulator';
import {createStyles, StyleRules, Theme, WithStyles, withStyles} from '@material-ui/core';
import React from 'react';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {
    EmulatorCloseBar,
    EmulatorState,
    EmulatorToolbar,
    ISiteApiProps,
    TidyComponent,
    withSiteApi,
} from '../../components';
import {IPersistentAppStateProps, withPersistentAppState} from '../app-state';
import {EmulatorStateDetails, TEmulatorState} from './emulation-state';


function styles(theme: Theme): StyleRules {
    return createStyles({
        container: {
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        hide: {
            display: 'none',
        },
        toolbar: {
            position: 'absolute',
            top: 0,
            left: 0,
        },
        closeBar: {
            position: 'absolute',
            top: 0,
            right: 0,
        },
    });
}


export interface IEmulatorContainerProps {
    readonly hideEmulator: boolean;
}

interface IEmulatorContainerState {
    readonly showToolbar: boolean;
    readonly emulatorState: TEmulatorState;
}

type TEmulatorContainerProps = IEmulatorContainerProps & IPersistentAppStateProps & ISiteApiProps & WithStyles;

class ComposedEmulatorContainer extends TidyComponent<TEmulatorContainerProps, IEmulatorContainerState> {

    private readonly sizeSubject = new BehaviorSubject<IContentSize>({heightPx: 0, widthPx: 0});
    private containerDiv: HTMLDivElement | null = null;

    constructor(props: TEmulatorContainerProps) {
        super(props);
        this.state = {showToolbar: true, emulatorState: {state: EmulatorState.NO_EMULATOR}};
    }

    private setEmulatorState(emulatorState: TEmulatorState): void {
        this.setState({emulatorState});
        this.props.persistentAppState.setEmulatorState(emulatorState.state);
    }


    componentDidMount(): void {
        const {containerDiv, sizeSubject, props: {persistentAppState, siteApi: {ageWasmJsUrl, ageWasmUrl}}} = this;
        const div = assertElement(containerDiv, 'app container <div>');

        // TODO closing the emulator leads to wasm reload
        const emulatorFactory = newEmulationFactory(ageWasmJsUrl, ageWasmUrl);

        this.unsubscribeOnUnmount(
            persistentAppState.appState$('romSource').pipe(
                switchMap(({romSource}): Observable<IEmulation | null> => {
                    if (!romSource) {
                        return of(null);
                    }
                    this.setEmulatorState({state: EmulatorState.EMULATOR_LOADING});
                    return emulatorFactory.newEmulation$(romSource);
                }),
            ).subscribe(
                emulation => this.setEmulatorState(emulation
                    ? {state: EmulatorState.EMULATOR_RUNNING, emulation}
                    : {state: EmulatorState.NO_EMULATOR}),
                error => this.setEmulatorState({state: EmulatorState.EMULATOR_ERROR, error}),
            ),
        );
        this.callOnUnmount(
            observeSize(div, (contentSize) => sizeSubject.next(contentSize)),
            () => sizeSubject.complete(),
            () => persistentAppState.setEmulatorState(EmulatorState.NO_EMULATOR),
        );
    }


    render(): JSX.Element {
        const {props: {hideEmulator, classes, persistentAppState}, state: {showToolbar, emulatorState}} = this;

        const toolbar = showToolbar || (emulatorState.state !== EmulatorState.EMULATOR_RUNNING);
        const classNames = hideEmulator ? `${classes.container} ${classes.hide}` : classes.container;

        return (
            <div className={classNames}
                 ref={(div) => this.containerDiv = div}
                 onClick={ev => {
                     // toggle the toolbar only if this div was clicked,
                     // not if this event was propagated to this div
                     if (ev.currentTarget === ev.target) {
                         this.setState({showToolbar: !showToolbar});
                     }
                 }}>

                {!hideEmulator && <EmulatorStateDetails emulatorState={emulatorState}
                                                        onConfirmError={() => persistentAppState.setRomSource(null)}/>}

                {toolbar && <>
                    <EmulatorToolbar className={classes.toolbar}
                                     openRomFile={localFile => persistentAppState.setRomSource({localFile})}/>

                    <EmulatorCloseBar className={classes.closeBar}
                                      closeEmulator={() => persistentAppState.setRomSource(null)}/>
                </>}

            </div>
        );
    }
}

export const EmulatorContainer = withStyles(styles)(
    withPersistentAppState(
        withSiteApi(
            ComposedEmulatorContainer,
        ),
    ),
);

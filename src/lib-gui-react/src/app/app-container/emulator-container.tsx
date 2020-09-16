import {cssClasses} from '@age-online/lib-common';
import {IEmulation} from '@age-online/lib-emulator';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import React, {ReactNode} from 'react';
import {Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {
    Emulator,
    EmulatorCloseBar,
    DisplayControls,
    EmulatorStartStopBar,
    EmulatorState,
    EmulatorToolbar,
    cycleDisplayControls,
    TidyComponent,
} from '../../components';
import {IPersistentAppStateProps, withPersistentAppState} from '../app-state';
import {EmulatorStateDetails, TEmulatorState} from './emulator-state';
import {IEmulatorFactory$Props, withEmulatorFactory$} from './with-emulation-factory';


const styles = (theme: Theme) => createStyles({
    container: {
        position: 'relative',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    hint: {
        // flex layout for centered loading-hint
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hide: {
        display: 'none',
    },
    bar: {
        position: 'absolute',
        opacity: 0.75,
    },
    toolbar: {
        top: 0,
        left: 0,
        borderBottomRightRadius: theme.spacing(2),
    },
    closeBar: {
        top: 0,
        right: 0,
        borderBottomLeftRadius: theme.spacing(2),
    },
    startStopBar: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
    },
});


export interface IEmulatorContainerProps {
    readonly hideEmulator: boolean;
}

interface IEmulatorContainerState {
    readonly pauseEmulation: boolean;
    readonly showBars: boolean;
    readonly emulatorState: TEmulatorState;
    readonly displayControls: DisplayControls;
}

type TEmulatorContainerProps = IEmulatorContainerProps & IEmulatorFactory$Props & IPersistentAppStateProps & WithStyles;

class ComposedEmulatorContainer extends TidyComponent<TEmulatorContainerProps, IEmulatorContainerState> {

    static getDerivedStateFromProps(nextProps: TEmulatorContainerProps,
                                    prevState: IEmulatorContainerState): Partial<IEmulatorContainerState> | null {

        return !nextProps.hideEmulator || !prevState.showBars
            ? null
            // hide the toolbar when navigating to another page
            : {showBars: false};
    }


    constructor(props: TEmulatorContainerProps) {
        super(props);

        const {displayControls} = props.currentAppState.appState;
        this.state = {
            pauseEmulation: false,
            showBars: false,
            emulatorState: {state: EmulatorState.NO_EMULATOR},
            displayControls,
        };
    }

    private setEmulatorState(emulatorState: TEmulatorState): void {
        this.setState({emulatorState});
        this.props.persistentAppState.setEmulatorState(emulatorState.state);
    }


    componentDidMount(): void {
        const {persistentAppState, emulatorFactory$} = this.props;

        this.unsubscribeOnUnmount(
            persistentAppState.appState$('romSource').pipe(
                switchMap(({romSource}): Observable<IEmulation | null> => {
                    if (!romSource) {
                        return of(null);
                    }
                    // this will re-mount the emulator component for every new rom
                    this.setEmulatorState({state: EmulatorState.EMULATOR_LOADING});
                    return emulatorFactory$.pipe(
                        switchMap(emulatorFactory => emulatorFactory.newEmulation$(romSource)),
                    );
                }),
            ).subscribe(
                emulation => {
                    this.setEmulatorState(emulation
                        ? {state: EmulatorState.EMULATOR_READY, emulation}
                        : {state: EmulatorState.NO_EMULATOR});
                },
                error => {
                    console.error(error);
                    this.setEmulatorState({state: EmulatorState.EMULATOR_ERROR, error});
                },
            ),
            persistentAppState.appState$('displayControls').subscribe(
                ({displayControls}) => this.setState({displayControls}),
            ),
        );
        this.callOnUnmount(
            () => persistentAppState.setEmulatorState(EmulatorState.NO_EMULATOR),
        );
    }


    render(): ReactNode {
        const {
            props: {hideEmulator, classes, persistentAppState},
            state: {pauseEmulation, showBars, emulatorState, displayControls},
        } = this;

        const {EMULATOR_READY} = EmulatorState;
        const pauseEmu = hideEmulator || pauseEmulation;

        const toolbar = showBars || (emulatorState.state !== EMULATOR_READY);
        const classNames = cssClasses(
            classes.container,
            emulatorState.state !== EMULATOR_READY ? classes.hint : '',
            hideEmulator ? classes.hide : '',
        );

        return (
            <div className={classNames}
                 onClick={ev => {
                     // toggle the toolbar only if this div was clicked,
                     // not if this event was propagated to this div
                     if (ev.currentTarget === ev.target) {
                         this.setState({showBars: !showBars});
                     }
                 }}>

                {!hideEmulator && <EmulatorStateDetails emulatorState={emulatorState}
                                                        onConfirmError={() => persistentAppState.setRomSource(null)}/>}

                {(emulatorState.state === EMULATOR_READY) && <Emulator emulation={emulatorState.emulation}
                                                                       pauseEmulation={pauseEmu}
                                                                       displayControls={displayControls}/>}

                {toolbar && <>
                    <EmulatorToolbar className={cssClasses(classes.toolbar, classes.bar)}
                                     displayControls={displayControls}
                                     cycleDisplayControls={() => {
                                         const emuControls = cycleDisplayControls(displayControls);
                                         persistentAppState.setDisplayControls(emuControls);
                                     }}
                                     openRomFile={localFile => {
                                         persistentAppState.setRomSource({localFile});
                                         this.setState({showBars: false});
                                     }}/>

                    <EmulatorCloseBar className={cssClasses(classes.closeBar, classes.bar)}
                                      closeEmulator={() => persistentAppState.setRomSource(null)}/>
                </>}

                {toolbar && (emulatorState.state === EMULATOR_READY) && (
                    <EmulatorStartStopBar className={cssClasses(classes.startStopBar, classes.bar)}
                                          emulationPaused={pauseEmu}
                                          startStopEmulator={
                                              () => this.setState({pauseEmulation: !pauseEmulation})
                                          }/>
                )}

            </div>
        );
    }
}

export const EmulatorContainer = withStyles(styles)(
    withPersistentAppState(
        withEmulatorFactory$(
            ComposedEmulatorContainer,
        ),
    ),
);

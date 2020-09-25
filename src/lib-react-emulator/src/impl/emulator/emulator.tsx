import {cssClasses, EmulationFactory, IEmulation, IEmulationFactory, TGameboyRomSource} from '@age-online/lib-core';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import React, {ReactNode} from 'react';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {EmulatorStateDetails, TEmulatorState} from './emulator-state';
import {EmulatorState, IEmulatorProps} from '../../api';
import {TidyComponent} from '@age-online/lib-react';
import {Emulation} from '../emulation';
import {EmulatorCloseBar, EmulatorStartStopBar, EmulatorToolbar} from '../emulator-bars';


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
        backgroundColor: theme.palette.background.default,
        opacity: 0.8,
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


interface IEmulatorState {
    readonly pauseEmulation: boolean;
    readonly showBars: boolean;
    readonly emulatorState: TEmulatorState;
}

type TEmulatorProps = IEmulatorProps & WithStyles;

class ComposedEmulator extends TidyComponent<TEmulatorProps, IEmulatorState> {

    static getDerivedStateFromProps(nextProps: TEmulatorProps,
                                    prevState: IEmulatorState): Partial<IEmulatorState> | null {

        return !nextProps.hideEmulator || !prevState.showBars
            ? null
            // hide the toolbar when navigating to another page
            : {showBars: false};
    }


    private readonly romSourceSub: BehaviorSubject<TGameboyRomSource | null>;
    private readonly emulationFactory: IEmulationFactory;

    constructor(props: TEmulatorProps) {
        super(props);

        const {ageWasmJsUrl, ageWasmUrl, romSource} = props;

        this.romSourceSub = new BehaviorSubject<TGameboyRomSource | null>(romSource);
        this.emulationFactory = new EmulationFactory(ageWasmJsUrl, ageWasmUrl);

        this.state = {
            pauseEmulation: false,
            showBars: false,
            emulatorState: {state: EmulatorState.NO_EMULATOR},
        };
    }

    private setEmulatorState(emulatorState: TEmulatorState): void {
        this.setState({emulatorState});
        this.props.onEmulatorState?.(emulatorState.state);
    }


    componentDidMount(): void {
        const {romSourceSub, emulationFactory} = this;

        this.unsubscribeOnUnmount(
            romSourceSub
                .asObservable()
                .pipe(
                    switchMap((romSource): Observable<IEmulation | null> => {
                        if (!romSource) {
                            return of(null);
                        }
                        // re-mount the emulator component for every new rom
                        this.setEmulatorState({state: EmulatorState.EMULATOR_LOADING});
                        return emulationFactory.newEmulation$(romSource);
                    }),
                )
                .subscribe(
                    emulation => {
                        this.setEmulatorState(emulation
                            ? {state: EmulatorState.EMULATOR_READY, emulation}
                            : {state: EmulatorState.NO_EMULATOR});
                    },
                    (error: unknown) => this.setEmulatorState({state: EmulatorState.EMULATOR_ERROR, error}),
                ),
        );

        this.callOnUnmount(
            () => this.props.onEmulatorState?.(EmulatorState.NO_EMULATOR),
        );
    }

    componentDidUpdate({romSource}: Readonly<TEmulatorProps>) {
        const {props, romSourceSub} = this;

        if (romSource !== props.romSource) {
            romSourceSub.next(romSource);
        }
    }


    render(): ReactNode {
        const {
            props: {hideEmulator, classes, displayControls, onDisplayControls, onRomSource},
            state: {pauseEmulation, showBars, emulatorState},
        } = this;

        const {EMULATOR_READY} = EmulatorState;
        const pauseEmu = hideEmulator || pauseEmulation;

        const toolbar = showBars || (emulatorState.state !== EMULATOR_READY);
        const classNames = cssClasses(
            classes.container,
            emulatorState.state === EMULATOR_READY ? '' : classes.hint,
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
                                                        onConfirmError={() => onRomSource?.(null)}/>}

                {(emulatorState.state === EMULATOR_READY) && <Emulation emulation={emulatorState.emulation}
                                                                        pauseEmulation={pauseEmu}
                                                                        displayControls={displayControls}/>}

                {toolbar && <>
                    <EmulatorToolbar className={cssClasses(classes.toolbar, classes.bar)}
                                     displayControls={displayControls}
                                     changeDisplayControls={controls => {
                                         onDisplayControls?.(controls);
                                     }}
                                     openRomFile={localFile => {
                                         onRomSource?.({localFile});
                                         this.setState({showBars: false});
                                     }}/>

                    <EmulatorCloseBar className={cssClasses(classes.closeBar, classes.bar)}
                                      closeEmulator={() => onRomSource?.(null)}/>
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

export const Emulator = withStyles(styles)(
    ComposedEmulator,
);

import {cssClasses, EmulationFactory, IEmulationFactory, newRomArchive, TGameboyRomSource} from '@age-online/lib-core';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import React, {Component, ReactNode} from 'react';
import {BehaviorSubject, noop, of} from 'rxjs';
import {catchError, concatMap, map} from 'rxjs/operators';
import {EmulatorStateDetails, TEmulatorState} from './emulator-state';
import {EmulatorState, IEmulatorProps} from '../../api';
import {ISiteApiProps, withSiteApi} from '@age-online/lib-react';
import {Emulation} from '../emulation';
import {EmulatorCloseBar, EmulatorStartStopBar, EmulatorToolbar} from '../emulator-bars';
import {newEmulation$} from './new-emulation';


const styles = (theme: Theme) => createStyles({
    container: {
        position: 'relative',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        minWidth: '320px',
        minHeight: '320px',
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
    readonly triggerRender: number;
    readonly showBars: boolean;
    readonly emulatorState: TEmulatorState;
}

type TEmulatorProps = IEmulatorProps & WithStyles & ISiteApiProps;

class ComposedEmulator extends Component<TEmulatorProps, IEmulatorState> {

    private readonly romSourceSubject: BehaviorSubject<TGameboyRomSource | null>;
    private readonly emulationFactory: IEmulationFactory;
    private readonly romArchive = newRomArchive('age-online-rom-archive');
    private isUnmounting = false;

    constructor(props: TEmulatorProps) {
        super(props);

        const {romSource, siteApi} = props;
        const ageWasmJsUrl = siteApi.assetUrl('/modules/age_wasm.js');
        const ageWasmUrl = siteApi.assetUrl('/modules/age_wasm.wasm');
        const ageAudioWorkletUrl = siteApi.assetUrl('/modules/age-audio-worklet.js');

        this.romSourceSubject = new BehaviorSubject<TGameboyRomSource | null>(romSource);
        this.emulationFactory = new EmulationFactory(ageWasmJsUrl, ageWasmUrl, ageAudioWorkletUrl);

        this.state = {
            triggerRender: 0,
            showBars: false,
            emulatorState: {state: EmulatorState.NO_EMULATOR},
        };
    }

    private setEmulatorState(emulatorState: TEmulatorState): void {
        this.props.onEmulatorState?.(emulatorState.state);
        if (!this.isUnmounting) {
            this.setState({emulatorState});
        }
    }

    private pauseEmulation(pauseEmulation: boolean): void {
        const {state: {emulatorState, triggerRender}} = this;

        if (emulatorState.state === EmulatorState.EMULATOR_READY) {
            emulatorState.emulation.pauseEmulation(pauseEmulation).then(
                () => this.setState({
                    showBars: emulatorState.emulation.isEmulationPaused(),
                    triggerRender: triggerRender + 1,
                }),
                noop, // ignore errors
            );
        }
    }


    componentDidMount(): void {
        const {romSourceSubject, emulationFactory, romArchive} = this;

        romSourceSubject
            .asObservable()
            .pipe(
                concatMap(romSource => {
                    // re-mount the emulator component for every new rom and
                    // display the loading hint
                    const {emulatorState} = this.state;
                    this.setEmulatorState({state: EmulatorState.EMULATOR_LOADING});

                    const oldEmulation = emulatorState.state === EmulatorState.EMULATOR_READY
                        ? emulatorState.emulation
                        : null;

                    return newEmulation$(romSource, oldEmulation, emulationFactory, romArchive).pipe(
                        map(
                            (emulation): TEmulatorState => (emulation
                                ? {state: EmulatorState.EMULATOR_READY, emulation}
                                : {state: EmulatorState.NO_EMULATOR}),
                        ),
                        // catch the error within concatMap so that we don't stop
                        // listening to romSourceSubject due to of()'s complete()
                        catchError(
                            (error: unknown) => of<TEmulatorState>({state: EmulatorState.EMULATOR_ERROR, error}),
                        ),
                    );
                }),
            )
            .subscribe(emulatorState => this.setEmulatorState(emulatorState));
    }

    componentDidUpdate({romSource, hideEmulator}: Readonly<TEmulatorProps>) {
        const {props, romSourceSubject} = this;

        if (romSource !== props.romSource) {
            romSourceSubject.next(props.romSource);
        }
        if (props.hideEmulator && (hideEmulator !== props.hideEmulator)) {
            this.pauseEmulation(true); // emulator now hidden => pause emulation
        }
    }

    componentWillUnmount() {
        // don't call setState after ram saving
        this.isUnmounting = true;

        // trigger ram saving
        const {romSourceSubject} = this;
        romSourceSubject.next(null);
        romSourceSubject.complete();
    }


    render(): ReactNode {
        const {
            props: {hideEmulator, classes, displayControls, onDisplayControls, onRomSource},
            state: {triggerRender, showBars, emulatorState},
        } = this;

        const {EMULATOR_READY} = EmulatorState;

        const toolbar = showBars || (emulatorState.state !== EMULATOR_READY);
        const emulation = emulatorState.state === EmulatorState.EMULATOR_READY ? emulatorState.emulation : undefined;

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

                {emulation && <Emulation emulation={emulation}
                                         pausedOnInit={() => {
                                             this.setState({showBars: true, triggerRender: triggerRender + 1});
                                         }}
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

                {toolbar && emulation && (
                    <EmulatorStartStopBar className={cssClasses(classes.startStopBar, classes.bar)}
                                          emulationPaused={emulation.isEmulationPaused()}
                                          startStopEmulator={() => {
                                              this.pauseEmulation(!emulation?.isEmulationPaused());
                                          }}/>
                )}

            </div>
        );
    }
}

export const Emulator = withStyles(styles)(
    withSiteApi(
        ComposedEmulator,
    ),
);

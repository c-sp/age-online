import {IEmulation} from '@age-online/lib-emulator';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import React, {ReactNode} from 'react';
import {Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {
    Emulator,
    EmulatorCloseBar,
    EmulatorControls,
    EmulatorState,
    EmulatorToolbar,
    nextEmulatorControls,
    TidyPureComponent,
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


export interface IEmulatorContainerProps {
    readonly hideEmulator: boolean;
}

interface IEmulatorContainerState {
    readonly showToolbar: boolean;
    readonly emulatorState: TEmulatorState;
    readonly emulatorControls: EmulatorControls;
}

type TEmulatorContainerProps = IEmulatorContainerProps & IEmulatorFactory$Props & IPersistentAppStateProps & WithStyles;

class ComposedEmulatorContainer extends TidyPureComponent<TEmulatorContainerProps, IEmulatorContainerState> {

    static getDerivedStateFromProps(nextProps: TEmulatorContainerProps,
                                    prevState: IEmulatorContainerState): Partial<IEmulatorContainerState> | null {

        return !nextProps.hideEmulator || !prevState.showToolbar
            ? null
            // hide the toolbar when navigating to another page
            : {showToolbar: false};
    }


    constructor(props: TEmulatorContainerProps) {
        super(props);

        const {emulatorControls} = props.currentAppState.appState;
        this.state = {
            showToolbar: false,
            emulatorState: {state: EmulatorState.NO_EMULATOR},
            emulatorControls,
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
                        ? {state: EmulatorState.EMULATOR_RUNNING, emulation}
                        : {state: EmulatorState.NO_EMULATOR});
                },
                error => this.setEmulatorState({state: EmulatorState.EMULATOR_ERROR, error}),
            ),
            persistentAppState.appState$('emulatorControls').subscribe(
                ({emulatorControls}) => this.setState({emulatorControls}),
            ),
        );
        this.callOnUnmount(
            () => persistentAppState.setEmulatorState(EmulatorState.NO_EMULATOR),
        );
    }


    render(): ReactNode {
        const {
            props: {hideEmulator, classes, persistentAppState},
            state: {showToolbar, emulatorState, emulatorControls},
        } = this;
        const {EMULATOR_RUNNING} = EmulatorState;

        const toolbar = showToolbar || (emulatorState.state !== EMULATOR_RUNNING);
        const classNames = [
            classes.container,
            ...(emulatorState.state !== EMULATOR_RUNNING ? [classes.hint] : []),
            ...(hideEmulator ? [classes.hide] : []),
        ];

        return (
            <div className={classNames.join(' ')}
                 onClick={ev => {
                     // toggle the toolbar only if this div was clicked,
                     // not if this event was propagated to this div
                     if (ev.currentTarget === ev.target) {
                         this.setState({showToolbar: !showToolbar});
                     }
                 }}>

                {!hideEmulator && <EmulatorStateDetails emulatorState={emulatorState}
                                                        onConfirmError={() => persistentAppState.setRomSource(null)}/>}

                {(emulatorState.state === EMULATOR_RUNNING) && <Emulator emulation={emulatorState.emulation}
                                                                         pauseEmulation={hideEmulator}
                                                                         emulatorControls={emulatorControls}/>}

                {toolbar && <>
                    <EmulatorToolbar className={classes.toolbar}
                                     emulatorControls={emulatorControls}
                                     cycleEmulatorControls={() => {
                                         const emuControls = nextEmulatorControls(emulatorControls);
                                         persistentAppState.setEmulatorControls(emuControls);
                                     }}
                                     openRomFile={localFile => {
                                         persistentAppState.setRomSource({localFile});
                                         this.setState({showToolbar: false});
                                     }}/>

                    <EmulatorCloseBar className={classes.closeBar}
                                      closeEmulator={() => persistentAppState.setRomSource(null)}/>
                </>}

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

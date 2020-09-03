import {assertElement, IContentSize, observeSize} from '@age-online/lib-common';
import {createStyles, StyleRules, Theme, WithStyles, withStyles} from '@material-ui/core';
import React from 'react';
import {BehaviorSubject} from 'rxjs';
import {
    EmulatorCloseBar,
    EmulatorState,
    EmulatorToolbar,
    ISiteApiProps,
    TidyComponent,
    withSiteApi,
} from '../../components';
import {IPersistentAppStateProps, withPersistentAppState} from '../app-state';


function styles(theme: Theme): StyleRules {
    return createStyles({
        container: {
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundColor: theme.palette.background.paper,
        },
        hide: {
            display: 'none',
        },
        toolbar: {
            position: 'absolute',
        },
        closeBar: {
            position: 'absolute',
            right: 0,
        },
    });
}


export interface IEmulatorContainerProps {
    readonly hideEmulator: boolean;
}

interface IEmulatorContainerState {
    readonly showToolbar: boolean;
}

type TEmulatorContainerProps = IEmulatorContainerProps & IPersistentAppStateProps & ISiteApiProps & WithStyles;

class ComposedEmulatorContainer extends TidyComponent<TEmulatorContainerProps, IEmulatorContainerState> {

    private readonly sizeSubject = new BehaviorSubject<IContentSize>({heightPx: 0, widthPx: 0});
    private containerDiv: HTMLDivElement | null = null;

    constructor(props: TEmulatorContainerProps) {
        super(props);
        this.state = {showToolbar: true};
    }

    componentDidMount(): void {
        const {containerDiv, sizeSubject, props: {persistentAppState}, /*siteApi: {ageWasmJsUrl, ageWasmUrl}}*/} = this;
        const div = assertElement(containerDiv, 'app container <div>');

        persistentAppState.setEmulatorState(EmulatorState.EMULATOR_LOADING); // TODO just for now ...

        this.callOnUnmount(
            observeSize(div, (contentSize) => sizeSubject.next(contentSize)),
            () => sizeSubject.complete(),
            () => persistentAppState.setEmulatorState(EmulatorState.NO_EMULATOR),
        );
    }

    render(): JSX.Element {
        const {props: {hideEmulator, classes, persistentAppState}, state: {showToolbar}} = this;

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

                {showToolbar && <>
                    <EmulatorToolbar className={classes.toolbar}
                                     openRomFile={localFile => persistentAppState.openRomFile({localFile})}/>

                    <EmulatorCloseBar className={classes.closeBar}
                                      closeEmulator={() => persistentAppState.openRomFile(null)}/>
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

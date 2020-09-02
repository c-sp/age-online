import {assertElement, IContentSize, observeSize} from '@age-online/lib-common';
import {createStyles, StyleRules, Theme, WithStyles, withStyles} from '@material-ui/core';
import React from 'react';
import {BehaviorSubject} from 'rxjs';
import {EmulatorToolbar, ISiteApiProps, TidyComponent, withSiteApi} from '../../components';
import {ICurrentAppStateProps, withCurrentAppState} from '../app-state';


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
            width: '100%',
        },
    });
}


export interface IEmulatorContainerProps {
    readonly hideEmulator: boolean;
}

interface IEmulatorContainerState {
    readonly showToolbar: boolean;
}

type TEmulatorContainerProps = IEmulatorContainerProps & ICurrentAppStateProps & ISiteApiProps & WithStyles;

class ComposedEmulatorContainer extends TidyComponent<TEmulatorContainerProps, IEmulatorContainerState> {

    private readonly sizeSubject = new BehaviorSubject<IContentSize>({heightPx: 0, widthPx: 0});
    private containerDiv: HTMLDivElement | null = null;

    constructor(props: TEmulatorContainerProps) {
        super(props);
        this.state = {showToolbar: true};
    }

    componentDidMount(): void {
        const {containerDiv, sizeSubject/*, props: {currentAppState, siteApi: {ageWasmJsUrl, ageWasmUrl}}*/} = this;
        const div = assertElement(containerDiv, 'app container <div>');

        this.callOnUnmount(
            observeSize(div, (contentSize) => sizeSubject.next(contentSize)),
            () => sizeSubject.complete(),
        );
    }

    render(): JSX.Element {
        const {props: {hideEmulator, classes}, state: {showToolbar}} = this;

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

                {showToolbar && <EmulatorToolbar className={classes.toolbar}/>}

            </div>
        );
    }
}

export const EmulatorContainer = withStyles(styles)(
    withCurrentAppState(
        withSiteApi(
            ComposedEmulatorContainer,
        ),
    ),
);

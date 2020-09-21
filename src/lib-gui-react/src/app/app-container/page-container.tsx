import {assertElement, observeSize} from '@age-online/lib-common';
import {createStyles, WithStyles, withStyles} from '@material-ui/core';
import React, {ReactNode} from 'react';
import {AppPage, EmulatorState, PageNavBar, TidyComponent} from '../../components';
import {IAppState, ICurrentAppStateProps, withCurrentAppState} from '../app-state';


const maxWidth = '1000px';

const styles = createStyles({
    container: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    page: {
        display: 'flex',

        '& > :nth-child(n+2)': {
            flex: '1 1 0',
            overflow: 'auto',
        },
    },
    pagePortrait: {
        flexDirection: 'column',

        // scrollbar at the viewport edge
        '& > :nth-child(n+2)': {
            '& > :first-child': {
                width: '100%',
                maxWidth,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
    },
    pageLandscape: {
        flexDirection: 'row',
        justifyContent: 'center',

        '& > :nth-child(n+2)': {
            maxWidth,
        },
    },
});


interface IPageContainerState {
    readonly verticalBar: boolean;
    readonly emulatorState: IAppState['emulatorState'];
}

export interface IPageContainerProps {
    readonly currentPage: AppPage;
}

type TPageContainerProps = IPageContainerProps & ICurrentAppStateProps & WithStyles;

class ComposedPageContainer extends TidyComponent<TPageContainerProps, IPageContainerState> {

    private containerDiv: HTMLDivElement | null = null;

    constructor(props: TPageContainerProps) {
        super(props);
        this.state = {verticalBar: false, emulatorState: EmulatorState.NO_EMULATOR};
    }

    componentDidMount(): void {
        const {containerDiv, props: {currentAppState}} = this;

        this.callOnUnmount(
            observeSize(
                assertElement(containerDiv, 'page container <div>'),
                (contentSize) => {
                    // Display a vertical navigation bar only on landscape-oriented phones
                    // (`width > height` and `height < 415px`).
                    //
                    // @see https://www.mydevice.io/#tab1
                    const {heightPx, widthPx} = contentSize;
                    const verticalBar = (widthPx > heightPx) && (heightPx < 415);
                    this.setState({verticalBar});
                },
            ),
        );

        this.unsubscribeOnUnmount(
            currentAppState.appState$('emulatorState').subscribe(
                ({emulatorState}) => this.setState({emulatorState}),
            ),
        );
    }

    render(): ReactNode {
        const {props: {currentPage, classes, children}, state: {verticalBar, emulatorState}} = this;

        const orientationCss = verticalBar ? classes.pageLandscape : classes.pagePortrait;
        const classNames = `${classes.container} ${classes.page} ${orientationCss}`;

        return (
            <div className={classNames}
                 ref={(div) => void (this.containerDiv = div)}>

                <PageNavBar verticalBar={verticalBar}
                            currentPage={currentPage}
                            emulatorState={emulatorState}/>

                <div>{children}</div>
            </div>
        );
    }
}

export const PageContainer = withStyles(styles)(
    withCurrentAppState(
        ComposedPageContainer,
    ),
);

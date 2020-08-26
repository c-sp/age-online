import {assertElement, IContentSize, observeSize} from '@age-online/lib-common';
import {createStyles, WithStyles, withStyles} from '@material-ui/core';
import React, {ReactNode} from 'react';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {INavBarProps, NavBar, TidyComponent} from '../../components';
import {AppStateManager, IAppState, IAppStateManagerProps, withAppStateManager} from '../app-state';


const styles = createStyles({
    container: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    page: {
        display: 'flex',

        // the page can grow & shrink
        '& > :nth-child(n+2)': {
            flex: '1 1 0',
            overflow: 'auto',
            maxWidth: '1000px',
            padding: '32px',
        },
    },
    pagePortrait: {
        flexDirection: 'column',
        alignItems: 'center',

        // the page may use the full width
        // (don't use alignItems: 'stretch' which breaks page alignment)
        '& > :nth-child(n+2)': {
            width: '100%',
        },
    },
    pageLandscape: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});


export interface IPageContainerProps {
    readonly children?: ReactNode;
}

interface IPageContainerState {
    readonly navBarProps: INavBarProps;
}

type TPageContainerProps = IPageContainerProps & IAppStateManagerProps & WithStyles;

class ComposedPageContainer extends TidyComponent<TPageContainerProps, IPageContainerState> {

    private readonly sizeSubject = new BehaviorSubject<IContentSize>({heightPx: 0, widthPx: 0});
    private containerDiv: HTMLDivElement | null = null;

    constructor(props: TPageContainerProps) {
        super(props);
        this.state = calculateState(props.appStateManager.appState, this.sizeSubject.value);
    }

    componentDidMount(): void {
        const {containerDiv, sizeSubject, props: {appStateManager}} = this;
        const div = assertElement(containerDiv, 'app container <div>');

        this.callOnUnmount(
            observeSize(div, (contentSize) => sizeSubject.next(contentSize)),
            () => sizeSubject.complete(),
        );

        this.unsubscribeOnUnmount(
            calculateState$(sizeSubject, appStateManager).subscribe((state) => this.setState(state)),
        );
    }

    render(): JSX.Element {
        const {props: {children, classes}, state: {navBarProps}} = this;

        const orientationCss = navBarProps.verticalBar ? classes.pageLandscape : classes.pagePortrait;
        const containerCssClasses = `${classes.container} ${classes.page} ${orientationCss}`;

        return (
            <div className={containerCssClasses}
                 ref={(div) => this.containerDiv = div}>

                <NavBar {...navBarProps}/>
                {children}

            </div>
        );
    }
}

export const PageContainer = withStyles(styles)(
    withAppStateManager(
        ComposedPageContainer,
    ),
);


function calculateState$(sizeSubject: BehaviorSubject<IContentSize>,
                         appStateManager: AppStateManager): Observable<IPageContainerState> {

    const landscapeOrPortrait$ = sizeSubject.asObservable().pipe(
        map(isPortrait),
        distinctUntilChanged(),
        map(() => sizeSubject.value),
    );

    return combineLatest([
        appStateManager.appState$('currentPage'),
        landscapeOrPortrait$,
    ]).pipe(
        map((values) => calculateState(...values)),
    );
}

function calculateState(appState: IAppState,
                        viewportSize: IContentSize): IPageContainerState {

    const {currentPage} = appState;

    const navBarProps: INavBarProps = {
        currentPage,
        verticalBar: !isPortrait(viewportSize),
    };

    return {navBarProps};
}

function isPortrait(contentSize: IContentSize): boolean {
    const {heightPx, widthPx} = contentSize;
    return heightPx >= widthPx;
}

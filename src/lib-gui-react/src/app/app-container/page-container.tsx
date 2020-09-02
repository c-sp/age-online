import {assertElement, IContentSize, observeSize} from '@age-online/lib-common';
import {createStyles, WithStyles, withStyles} from '@material-ui/core';
import React from 'react';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {IPageNavBarProps, PageNavBar, TidyComponent} from '../../components';
import {IAppState, ICurrentAppState, ICurrentAppStateProps, withCurrentAppState} from '../app-state';


interface IPageContainerState {
    readonly navBarProps: IPageNavBarProps;
}

/**
 * Display a vertical navigation bar only on landscape-oriented phones
 * (`width > height` and `height < 415px`).
 *
 * @see https://www.mydevice.io/#tab1
 */
function showVerticalNavBar(contentSize: IContentSize): boolean {
    const {heightPx, widthPx} = contentSize;
    return (widthPx > heightPx) && (heightPx < 415);
}

function calculateState(contentSize: IContentSize, {currentPage}: IAppState): IPageContainerState {
    const verticalBar = showVerticalNavBar(contentSize);
    return {
        navBarProps: {verticalBar, currentPage},
    };
}

function calculateState$(contentSizeSubject: BehaviorSubject<IContentSize>,
                         currentAppState: ICurrentAppState): Observable<IPageContainerState> {

    // reduce content-size changes to vertical-nav-bar changes
    const contentSize$ = contentSizeSubject.asObservable().pipe(
        map(showVerticalNavBar),
        distinctUntilChanged(),
        map(() => contentSizeSubject.value)
    );

    return combineLatest([
        contentSize$,
        currentAppState.appState$('currentPage'),
    ]).pipe(
        map(([contentSize, appState]) => calculateState(contentSize, appState)),
    );
}


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

type TPageContainerProps = ICurrentAppStateProps & WithStyles;

class ComposedPageContainer extends TidyComponent<TPageContainerProps, IPageContainerState> {

    private readonly sizeSubject = new BehaviorSubject<IContentSize>({heightPx: 0, widthPx: 0});
    private containerDiv: HTMLDivElement | null = null;

    constructor(props: TPageContainerProps) {
        super(props);
        this.state = calculateState(this.sizeSubject.value, props.currentAppState.appState);
    }

    componentDidMount(): void {
        const {containerDiv, sizeSubject, props: {currentAppState}} = this;
        const div = assertElement(containerDiv, 'app container <div>');

        this.callOnUnmount(
            observeSize(div, (contentSize) => sizeSubject.next(contentSize)),
            () => sizeSubject.complete(),
        );

        this.unsubscribeOnUnmount(
            calculateState$(sizeSubject, currentAppState).subscribe((state) => this.setState(state)),
        );
    }

    render(): JSX.Element {
        const {props: {children, classes}, state: {navBarProps}} = this;

        const orientationCss = navBarProps.verticalBar ? classes.pageLandscape : classes.pagePortrait;
        const classNames = `${classes.container} ${classes.page} ${orientationCss}`;

        return (
            <div className={classNames}
                 ref={(div) => this.containerDiv = div}>

                <PageNavBar {...navBarProps}/>
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

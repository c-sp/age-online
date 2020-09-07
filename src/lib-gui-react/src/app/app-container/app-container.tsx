import React, {ReactElement} from 'react';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppPage, TidyComponent} from '../../components';
import {IAppState, ICurrentAppState, ICurrentAppStateProps, withCurrentAppState} from '../app-state';
import {EmulatorContainer} from './emulator-container';
import {PageContainer} from './page-container';


interface IAppContainerState {
    readonly renderEmulator: boolean;
    readonly renderPage: boolean;
}

function calculateAppContainerState$(currentAppState: ICurrentAppState): Observable<IAppContainerState> {
    return currentAppState.appState$('currentPage', 'romSource').pipe(
        map(calculateAppContainerState),
    );
}

function calculateAppContainerState(appState: IAppState): IAppContainerState {
    const {romSource, currentPage} = appState;
    return {
        renderEmulator: !!romSource,
        renderPage: !romSource || (currentPage !== AppPage.HOME),
    };
}


export interface IAppContainerProps {
    readonly children?: ReactElement;
}

type TAppContainerProps = IAppContainerProps & ICurrentAppStateProps;

class ComposedAppContainer extends TidyComponent<TAppContainerProps, IAppContainerState> {

    constructor(props: ICurrentAppStateProps) {
        super(props);
        this.state = calculateAppContainerState(props.currentAppState.appState);
    }

    componentDidMount(): void {
        this.unsubscribeOnUnmount(
            calculateAppContainerState$(this.props.currentAppState).subscribe((state) => this.setState(state)),
        );
    }

    render(): JSX.Element {
        const {props: {children}, state: {renderEmulator, renderPage}} = this;
        return <>
            {renderEmulator ? <EmulatorContainer hideEmulator={renderPage}/> : false}
            {renderPage ? <PageContainer>{children}</PageContainer> : false}
        </>;
    }
}

export const AppContainer = withCurrentAppState(
    ComposedAppContainer,
);

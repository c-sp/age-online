import {IEmulationFactory} from '@age-online/lib-emulator';
import React, {ReactElement, ReactNode} from 'react';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppPage, ISiteApiProps, TidyComponent, withSiteApi} from '../../components';
import {IAppState, ICurrentAppStateProps, withCurrentAppState} from '../app-state';
import {EmulatorContainer} from './emulator-container';
import {PageContainer} from './page-container';
import {emulatorFactory$, EmulatorFactory$Context} from './with-emulation-factory';


interface IAppContainerState {
    readonly emulatorActive: boolean;
}

function calculateAppContainerState({romSource}: IAppState): IAppContainerState {
    return {emulatorActive: !!romSource};
}


export interface IAppContainerProps {
    readonly children?: ReactElement;
}

type TAppContainerProps = IAppContainerProps & ICurrentAppStateProps & ISiteApiProps;

class ComposedAppContainer extends TidyComponent<TAppContainerProps, IAppContainerState> {

    private readonly emulatorFactory$: Observable<IEmulationFactory>;

    constructor(props: TAppContainerProps) {
        super(props);
        const {siteApi: {ageWasmJsUrl, ageWasmUrl}} = props;
        this.emulatorFactory$ = emulatorFactory$(ageWasmJsUrl, ageWasmUrl);
        this.state = calculateAppContainerState(props.currentAppState.appState);
    }

    componentDidMount(): void {
        this.unsubscribeOnUnmount(
            this.props.currentAppState
                .appState$('romSource')
                .pipe(map(calculateAppContainerState))
                .subscribe((state) => this.setState(state)),
        );
    }

    render(): ReactNode {
        const {emulatorFactory$, props: {children, siteApi: {currentPage}}, state: {emulatorActive}} = this;

        const renderPage = !emulatorActive || (currentPage !== AppPage.HOME);

        return (
            <EmulatorFactory$Context.Provider value={emulatorFactory$}>

                {emulatorActive && <EmulatorContainer hideEmulator={renderPage}/>}
                {renderPage && <PageContainer>{children}</PageContainer>}

            </EmulatorFactory$Context.Provider>
        );
    }
}

export const AppContainer = withCurrentAppState(
    withSiteApi(
        ComposedAppContainer,
    ),
);

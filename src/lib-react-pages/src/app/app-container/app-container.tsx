import {CssBaseline, Theme, ThemeProvider} from '@material-ui/core';
import {I18nContext, I18nDetails, I18nManager} from '@shopify/react-i18n';
import React, {ReactNode} from 'react';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppPage} from '../../components';
import {AppStateContext, IAppState, PersistentAppState} from '../app-state';
import {EmulatorContainer} from './emulator-container';
import {newEmulationFactory$, newRomArchive$} from './lib-react-emulator';
import {PageContainer} from './page-container';
import {IEmulationFactory, IRomArchive} from '@age-online/lib-core';
import {ErrorBoundary, Locale, TidyComponent} from '@age-online/lib-react';


interface IAppContainerState {
    readonly emulatorActive: boolean;
    readonly currentTheme: Theme;
    readonly error?: unknown;
}

function calculateAppContainerState({romSource, currentTheme}: IAppState): IAppContainerState {
    return {emulatorActive: !!romSource, currentTheme};
}


export interface IAppContainerProps {
    readonly locale: Locale;
    readonly currentPage: AppPage;
    readonly ageWasmJsUrl: string;
    readonly ageWasmUrl: string;
    readonly globalCss?: object;
    readonly children?: ReactNode;
}

export class AppContainer extends TidyComponent<IAppContainerProps, IAppContainerState> {

    private readonly i18nManager: I18nManager;
    private readonly persistentAppState: PersistentAppState;
    private readonly emulationFactory$: Observable<IEmulationFactory>;
    private readonly romArchive$: Observable<IRomArchive>;

    constructor(props: IAppContainerProps) {
        super(props);
        const {locale, ageWasmJsUrl, ageWasmUrl, globalCss} = props;

        this.i18nManager = new I18nManager(i18nDetails(locale));
        this.persistentAppState = new PersistentAppState(globalCss);
        this.emulationFactory$ = newEmulationFactory$(ageWasmJsUrl, ageWasmUrl);
        this.romArchive$ = newRomArchive$('age-online-rom-archive');

        this.state = calculateAppContainerState(this.persistentAppState.appState);
    }

    componentDidMount(): void {
        this.unsubscribeOnUnmount(
            this.persistentAppState
                .appState$('romSource', 'currentTheme')
                .pipe(map(calculateAppContainerState))
                .subscribe((state) => this.setState(state)),
        );

        this.callOnUnmount(() => this.persistentAppState.cleanup());

        // catch unhandled errors
        window.onerror = (_message, _source, _lineno, _colno, error) => this.setState({error});
        window.onunhandledrejection = ({reason}: PromiseRejectionEvent) => this.setState({error: reason as unknown});
    }

    componentDidUpdate(): void {
        const {i18nManager, props: {locale}} = this;

        if (locale !== i18nManager.details.locale) {
            i18nManager.update(i18nDetails(locale));
        }
    }


    render(): ReactNode {
        const {i18nManager, persistentAppState, emulationFactory$, romArchive$, props, state} = this;
        const {currentPage, children} = props;
        const {emulatorActive, currentTheme, error} = state;

        const renderPage = !emulatorActive || (currentPage !== AppPage.HOME);

        // Material UI's CssBaseline activates the font "Roboto" on <body>
        // and resets box-sizing as described in:
        // https://css-tricks.com/box-sizing/#article-header-id-6
        //
        // Note that we must declare it within <ThemeProvider> to handle theme
        // changes appropriately.
        return (
            <ThemeProvider theme={currentTheme}>
                <CssBaseline/>

                <ErrorBoundary error={error}
                               locale={i18nManager.details.locale}
                               showReloadButton={true}>

                    <AppStateContext.Provider value={persistentAppState}>
                        <I18nContext.Provider value={i18nManager}>

                            {emulatorActive && <EmulatorContainer hideEmulator={renderPage}
                                                                  emulationFactory$={emulationFactory$}
                                                                  romArchive$={romArchive$}/>}

                            {renderPage && <PageContainer currentPage={currentPage}>{children}</PageContainer>}

                        </I18nContext.Provider>
                    </AppStateContext.Provider>

                </ErrorBoundary>

            </ThemeProvider>
        );
    }
}


function i18nDetails(locale: Locale): I18nDetails {
    return {
        locale,
        onError(err): void {
            // let the translation/formatting causing the error return
            // an empty string by not re-throwing the error
            console.error('i18n error', err);
        },
    };
}

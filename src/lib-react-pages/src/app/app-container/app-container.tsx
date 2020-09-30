import {CssBaseline, ThemeProvider} from '@material-ui/core';
import {I18nContext, I18nDetails, I18nManager} from '@shopify/react-i18n';
import React, {ComponentType, ReactNode} from 'react';
import {map} from 'rxjs/operators';
import {AppStateContext, IAppState, PersistentAppState} from '../app-state';
import {PageContainer} from './page-container';
import {AppPage, ErrorBoundary, Locale, TidyComponent} from '@age-online/lib-react';
import {IEmulatorProps} from '@age-online/lib-react-emulator';
import {ErrorWithCause} from '@age-online/lib-core';


interface IAppContainerState {
    readonly currentTheme: IAppState['currentTheme'];
    readonly displayControls: IAppState['displayControls'];
    readonly romSource: IAppState['romSource'];
    readonly EmulatorComponent?: ComponentType<IEmulatorProps>;
    readonly error?: unknown;
}

function calculateAppContainerState({currentTheme, displayControls, romSource}: IAppState): IAppContainerState {
    return {currentTheme, displayControls, romSource};
}


export interface IAppContainerProps {
    readonly locale: Locale;
    readonly currentPage: AppPage;
    readonly globalCss?: object;
    readonly children?: ReactNode;
}

export class AppContainer extends TidyComponent<IAppContainerProps, IAppContainerState> {

    private readonly i18nManager: I18nManager;
    private readonly persistentAppState: PersistentAppState;

    constructor(props: IAppContainerProps) {
        super(props);
        const {locale, globalCss} = props;

        this.i18nManager = new I18nManager(i18nDetails(locale));
        this.persistentAppState = new PersistentAppState(globalCss);

        this.state = calculateAppContainerState(this.persistentAppState.appState);
    }

    componentDidMount(): void {
        this.unsubscribeOnUnmount(
            this.persistentAppState
                .appState$('romSource', 'currentTheme', 'displayControls')
                .pipe(map(calculateAppContainerState))
                .subscribe((state) => {
                    this.setState(state);
                    if (this.state.EmulatorComponent || !state.romSource) {
                        return;
                    }
                    import('@age-online/lib-react-emulator').then(
                        mod => this.setState({EmulatorComponent: mod.emulatorComponent()}),
                        err => {
                            // we rely on <ErrorBoundary> to display the error
                            // message and a "reload page" button
                            throw new ErrorWithCause('error loading emulator library', err);
                        },
                    );
                }),
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
        const {i18nManager, persistentAppState, props, state} = this;
        const {currentPage, children} = props;
        const {currentTheme, displayControls, romSource, error, EmulatorComponent} = state;

        const emulatorActive = !!romSource;
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

                            {emulatorActive && EmulatorComponent
                            && <EmulatorComponent hideEmulator={renderPage}
                                                  displayControls={displayControls}
                                                  romSource={romSource}
                                                  onDisplayControls={v => persistentAppState.setDisplayControls(v)}
                                                  onEmulatorState={v => persistentAppState.setEmulatorState(v)}
                                                  onRomSource={v => persistentAppState.setRomSource(v)}/>}

                            {renderPage
                            && <PageContainer currentPage={currentPage}>{children}</PageContainer>}

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

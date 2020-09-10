import {Unsubscriber} from '@age-online/lib-common';
import {
    AppContainer,
    AppPage,
    AppStateContext,
    ErrorBoundary,
    FALLBACK_LOCALE,
    isAppPage,
    isLocale,
    Locale,
    PersistentAppState,
    SiteApiContext,
} from '@age-online/lib-gui-react';
import {CssBaseline, Theme, ThemeProvider} from '@material-ui/core';
import {I18nContext, I18nDetails, I18nManager} from '@shopify/react-i18n';
import App from 'next/app';
import {AppProps} from 'next/dist/pages/_app';
import React, {ReactElement} from 'react';
import {NextSiteApi} from '../common';


interface IAppState {
    readonly currentTheme: Theme;
    readonly error?: unknown;
}


export default class AgeOnlineApp extends App<{}, {}, IAppState> {

    private readonly i18nManager: I18nManager;
    private readonly siteApi: NextSiteApi;
    private readonly persistentAppState: PersistentAppState;
    private readonly unsubscriber = new Unsubscriber();

    constructor(props: AppProps) {
        super(props);

        // pathname='/[locale]/settings'
        // asPath='/de/settings'
        const {asPath, basePath} = props.router;

        const loc = localeFromPathname(asPath);
        this.i18nManager = new I18nManager(i18nDetails(loc));
        this.siteApi = new NextSiteApi(loc, appPageFromPathname(asPath), basePath);
        this.persistentAppState = new PersistentAppState({
            '#__next': {
                height: '100%',
            }
        });

        const {currentTheme} = this.persistentAppState.appState;
        this.state = {currentTheme};
    }


    componentWillUnmount() {
        this.unsubscriber.cleanup();
    }

    componentDidMount(): void {
        const {persistentAppState, unsubscriber} = this;
        unsubscriber.callOnCleanup(() => persistentAppState.cleanup());

        // update ThemeProvider on theme change
        unsubscriber.trackSubscriptions(
            persistentAppState.appState$('currentTheme').subscribe(({currentTheme}) => this.setState({currentTheme})),
        );

        // catch unhandled errors
        window.onerror = (_message, _source, _lineno, _colno, error) => this.setState({error});
        window.onunhandledrejection = ({reason}: PromiseRejectionEvent) => this.setState({error: reason as unknown});
    }

    componentDidUpdate(): void {
        const {i18nManager, siteApi, props: {router: {asPath}}} = this;

        // Adjusting locale here does not cause a RootLayout re-render as we
        // don't update props or state.
        // Components wrapped with withI18nBundle() will be re-rendered,
        // but not RootLayout.
        const loc = localeFromPathname(asPath);
        if (loc !== i18nManager.details.locale) {
            siteApi.setCurrentLocale(loc);
            i18nManager.update(i18nDetails(loc));
        }
    }


    render(): ReactElement {
        const {siteApi, persistentAppState, i18nManager, props, state: {currentTheme, error}} = this;
        const {Component, pageProps, router: {asPath}} = props;

        // We can update the page on every render() because the whole site is
        // rendered anyway when switching pages.
        siteApi.currentPage = appPageFromPathname(asPath);

        // Material UI's CssBaseline activates the font "Roboto" on <body>
        // and resets box-sizing as described in:
        // https://css-tricks.com/box-sizing/#article-header-id-6
        //
        // Note that we must declare it within <ThemeProvider> to handle theme
        // changes appropriately.
        return <>
            <ThemeProvider theme={currentTheme}>
                <CssBaseline/>

                <ErrorBoundary error={error}
                               locale={i18nManager.details.locale}
                               showReloadButton={true}>

                    <SiteApiContext.Provider value={siteApi}>
                        <AppStateContext.Provider value={persistentAppState}>
                            <I18nContext.Provider value={i18nManager}>

                                <AppContainer>
                                    <Component {...pageProps}/>
                                </AppContainer>

                            </I18nContext.Provider>
                        </AppStateContext.Provider>
                    </SiteApiContext.Provider>

                </ErrorBoundary>

            </ThemeProvider>
        </>;
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


function localeFromPathname(pathname: string): Locale {
    const [locale] = splitPathname(pathname);
    return isLocale(locale) ? locale : FALLBACK_LOCALE;
}

function appPageFromPathname(pathname: string): AppPage {
    const pathParts = splitPathname(pathname);
    // ['en', 'foo'] => ['foo']
    // ['xy', 'foo'] => ['xy', 'foo']
    const appPageStr = `/${isLocale(pathParts[0]) ? pathParts.slice(1) : pathParts}`;
    return isAppPage(appPageStr) ? appPageStr : AppPage.HOME;
}

/**
 * '/de/foo' => ['', 'de', 'foo'] => ['de', 'foo']
 *
 * '/foo' => ['', 'foo'] => ['foo']
 */
function splitPathname(pathname: string): string[] {
    return pathname.split('/').slice(1);
}

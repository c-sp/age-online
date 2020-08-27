import {
    AppPage,
    AppStateManager,
    AppStateManagerContext,
    ErrorBoundary,
    FALLBACK_LOCALE,
    isAppPage,
    isValidLocale,
    PageContainer,
    SiteApiContext,
    TidyComponent,
    TLocale,
} from '@age-online/lib-gui-react';
import {CssBaseline, Theme, ThemeProvider} from '@material-ui/core';
import {I18nContext, I18nDetails, I18nManager} from '@shopify/react-i18n';
import {PageProps} from 'gatsby';
import React, {ReactNode} from 'react';
import {GatsbySiteApi} from './gatsby-site-api';


interface IPageContext {
    readonly locale?: string;
    readonly page: string;
}

type TRootLayoutProps = PageProps<Record<string, unknown>, IPageContext>;

interface IRootLayoutState {
    readonly currentTheme: Theme;
    readonly error?: unknown;
}


/**
 * As long as Gatsby does not support TypeScript configuration files we use
 * `gatsby-plugin-layout` for handling our app's global state.
 *
 * `gatsby-plugin-layout` implements the corresponding Gatsby browser API and
 * SSR API for us.
 *
 * @see https://www.gatsbyjs.org/packages/gatsby-plugin-layout
 * @see https://github.com/gatsbyjs/gatsby/issues/18983 Gatsby native TypeScript support
 * @see https://gatsbyjs.org/docs/browser-apis/#wrapPageElement
 * @see https://gatsbyjs.org/docs/ssr-apis/#wrapPageElement
 */
export default class RootLayout extends TidyComponent<TRootLayoutProps, IRootLayoutState> {

    private readonly i18nManager: I18nManager;
    private readonly siteApi: GatsbySiteApi;
    private readonly appStateManager = new AppStateManager({
        '#___gatsby, #___gatsby > div': {
            height: '100%',
        }
    });

    constructor(props: TRootLayoutProps) {
        super(props);

        const {pageContext: {locale, page}} = props;
        const currentPage = appPageFromPath(page);

        const loc = getLocale(locale);
        this.i18nManager = new I18nManager(i18nDetails(loc));
        this.siteApi = new GatsbySiteApi(loc);
        this.appStateManager.setCurrentPage(currentPage);

        const {currentTheme} = this.appStateManager.appState;
        this.state = {currentTheme};
    }


    componentDidMount(): void {
        const {appStateManager} = this;
        this.callOnUnmount(() => appStateManager.cleanup());

        // update ThemeProvider on theme change
        this.unsubscribeOnUnmount(
            appStateManager.appState$('currentTheme').subscribe(({currentTheme}) => this.setState({currentTheme})),
        );

        // catch unhandled errors
        window.onerror = (_message, _source, _lineno, _colno, error) => this.setState({error});
        window.onunhandledrejection = ({reason}: PromiseRejectionEvent) => this.setState({error: reason as unknown});
    }

    componentDidUpdate(): void {
        const {appStateManager, i18nManager, siteApi, props: {pageContext: {locale, page}}} = this;

        // Adjusting locale/currentPage here does not cause a re-render as we
        // don't update props or state.
        // => components wrapped with withI18nBundle() will be re-rendered,
        //    but not RootLayout

        const loc = getLocale(locale);
        if (loc !== i18nManager.details.locale) {
            siteApi.setCurrentLocale(loc);
            i18nManager.update(i18nDetails(loc));
        }

        const currentPage = appPageFromPath(page);
        appStateManager.setCurrentPage(currentPage);
    }


    render(): ReactNode {
        const {siteApi, appStateManager, i18nManager, props, state: {currentTheme, error}} = this;
        const {children} = props;

        // Material UI's CssBaseline activates the font "Roboto" on <body>
        // and resets box-sizing as described in:
        // https://css-tricks.com/box-sizing/#article-header-id-6
        //
        // Note that we must declare it within <ThemeProvider> to handle theme
        // changes appropriately.
        return (
            <ErrorBoundary error={error} locale={i18nManager.details.locale}>

                <SiteApiContext.Provider value={siteApi}>
                    <AppStateManagerContext.Provider value={appStateManager}>
                        <I18nContext.Provider value={i18nManager}>
                            <ThemeProvider theme={currentTheme}>
                                <CssBaseline/>

                                <PageContainer>{children}</PageContainer>

                            </ThemeProvider>
                        </I18nContext.Provider>
                    </AppStateManagerContext.Provider>
                </SiteApiContext.Provider>

            </ErrorBoundary>
        );
    }
}


function i18nDetails(locale: TLocale): I18nDetails {
    return {
        locale,
        onError(err): void {
            // let the translation/formatting causing the error return
            // an empty string by not re-throwing the error
            console.error('i18n error', err);
        },
    };
}


function getLocale(locale: string | undefined): TLocale {

    return (isValidLocale(locale) ? locale : null)
        // check local storage for user preference
        // TODO ?? LOCAL_STORAGE.getPreferredLocale()
        // check navigator locale
        ?? navigatorLocale()
        // use default locale
        ?? FALLBACK_LOCALE;

    function navigatorLocale(): TLocale | null {
        const navLocale = (typeof navigator === 'undefined' ? '' : navigator.language).slice(0, 2);
        return isValidLocale(navLocale) ? navLocale : null;
    }
}


function appPageFromPath(path: string): AppPage {
    // '/de/foo' => ['', 'en', 'foo'] => ['en', 'foo']
    const pathParts = path.split('/').slice(1);

    // ['en', 'foo'] => ['foo']
    // ['xy', 'foo'] => ['xy', 'foo']
    const appPageStr = `/${isValidLocale(pathParts[0]) ? pathParts.slice(1) : pathParts}`;

    return isAppPage(appPageStr) ? appPageStr : AppPage.HOME;
}

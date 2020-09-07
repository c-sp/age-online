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
    TidyComponent,
} from '@age-online/lib-gui-react';
import {CssBaseline, Theme, ThemeProvider} from '@material-ui/core';
import {I18nContext, I18nDetails, I18nManager} from '@shopify/react-i18n';
import {PageProps} from 'gatsby';
import React, {ReactNode} from 'react';
import {Helmet} from 'react-helmet';
import {GatsbySiteApi} from './gatsby-site-api';


interface IPageContext {
    readonly locale?: string;
    readonly page: string;
    readonly pathPrefix: string;
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
    private readonly persistentAppState: PersistentAppState;
    private readonly fontsPath: string;

    constructor(props: TRootLayoutProps) {
        super(props);

        const {pageContext: {locale, page, pathPrefix}} = props;
        const currentPage = appPageFromPath(page);

        const loc = getLocale(locale);
        this.i18nManager = new I18nManager(i18nDetails(loc));
        this.siteApi = new GatsbySiteApi(loc);

        this.persistentAppState = new PersistentAppState({
            '#___gatsby, #___gatsby > div': {
                height: '100%',
            }
        });
        this.persistentAppState.setCurrentPage(currentPage);

        this.fontsPath = `${pathPrefix}/fonts`;

        const {currentTheme} = this.persistentAppState.appState;
        this.state = {currentTheme};
    }


    componentDidMount(): void {
        const {persistentAppState} = this;
        this.callOnUnmount(() => persistentAppState.cleanup());

        // update ThemeProvider on theme change
        this.unsubscribeOnUnmount(
            persistentAppState.appState$('currentTheme').subscribe(({currentTheme}) => this.setState({currentTheme})),
        );

        // catch unhandled errors
        window.onerror = (_message, _source, _lineno, _colno, error) => this.setState({error});
        window.onunhandledrejection = ({reason}: PromiseRejectionEvent) => this.setState({error: reason as unknown});
    }

    componentDidUpdate(): void {
        const {persistentAppState, i18nManager, siteApi, props: {pageContext: {locale, page}}} = this;

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
        persistentAppState.setCurrentPage(currentPage);
    }


    render(): ReactNode {
        const {fontsPath, siteApi, persistentAppState, i18nManager, props, state: {currentTheme, error}} = this;
        const {children} = props;

        // https://google-webfonts-helper.herokuapp.com/fonts/roboto?subsets=latin
        const robotoPath = `${fontsPath}/roboto/roboto-v20-latin-regular.woff`;
        const roboto2Path = `${fontsPath}/roboto/roboto-v20-latin-regular.woff2`;

        // https://google-webfonts-helper.herokuapp.com/fonts/roboto-condensed?subsets=latin
        const robotoCondensedPath = `${fontsPath}/roboto-condensed/roboto-condensed-v18-latin-regular.woff`;
        const robotoCondensed2Path = `${fontsPath}/roboto-condensed/roboto-condensed-v18-latin-regular.woff2`;

        const fontAttributes = {as: "font", type: "font/woff2", crossOrigin: "anonymous"};

        // Material UI's CssBaseline activates the font "Roboto" on <body>
        // and resets box-sizing as described in:
        // https://css-tricks.com/box-sizing/#article-header-id-6
        //
        // Note that we must declare it within <ThemeProvider> to handle theme
        // changes appropriately.
        return <>
            <Helmet>
                <link rel="preload" href={roboto2Path} {...fontAttributes}/>
                <link rel="preload" href={robotoCondensed2Path} {...fontAttributes}/>
                <style type="text/css">{`
                    @font-face {
                        font-family: "Roboto";
                        font-style: normal;
                        font-weight: 400;
                        font-display: swap;
                        src: local("Roboto"), local("Roboto-Regular"),
                             url("${roboto2Path}") format("woff2"),
                             url("${robotoPath}") format("woff");
                    }

                    @font-face {
                        font-family: "Roboto Condensed";
                        font-style: normal;
                        font-weight: 400;
                        font-display: swap;
                        src: local("Roboto Condensed"), local("RobotoCondensed-Regular"),
                             url("${robotoCondensed2Path}") format("woff2"),
                             url("${robotoCondensedPath}") format("woff");
                    }
                `}</style>
            </Helmet>

            <ThemeProvider theme={currentTheme}>
                <CssBaseline/>

                <ErrorBoundary error={error}
                               locale={i18nManager.details.locale}
                               showReloadButton={true}>

                    <SiteApiContext.Provider value={siteApi}>
                        <AppStateContext.Provider value={persistentAppState}>
                            <I18nContext.Provider value={i18nManager}>

                                <AppContainer>{children}</AppContainer>

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


function getLocale(locale: string | undefined): Locale {
    return isLocale(locale) ? locale : FALLBACK_LOCALE;
}


function appPageFromPath(path: string): AppPage {
    // '/de/foo' => ['', 'en', 'foo'] => ['en', 'foo']
    const pathParts = path.split('/').slice(1);

    // ['en', 'foo'] => ['foo']
    // ['xy', 'foo'] => ['xy', 'foo']
    const appPageStr = `/${isLocale(pathParts[0]) ? pathParts.slice(1) : pathParts}`;

    return isAppPage(appPageStr) ? appPageStr : AppPage.HOME;
}

import {AppHelmet, appPageFromPathname, localeFromPathname} from '@age-online/app-common';
import {AppContainer, SiteApiContext} from '@age-online/lib-gui-react';
import {PageProps, withPrefix} from 'gatsby';
import React, {Component, ReactNode} from 'react';
import {GatsbySiteApi} from './gatsby-site-api';


interface IPageContext {
    readonly page: string;
    readonly pathPrefix: string;
}

type TRootLayoutProps = PageProps<Record<string, unknown>, IPageContext>;


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
export default class RootLayout extends Component<TRootLayoutProps> {

    private readonly globalCss = {
        '#___gatsby, #___gatsby > div': {
            height: '100%',
        }
    };
    private readonly ageWasmJsUrl: string;
    private readonly ageWasmUrl: string;
    private readonly siteApi: GatsbySiteApi;

    constructor(props: TRootLayoutProps) {
        super(props);
        const {path} = props;

        this.ageWasmJsUrl = withPrefix('/age-wasm/age_wasm.js');
        this.ageWasmUrl = withPrefix('/age-wasm/age_wasm.wasm');

        this.siteApi = new GatsbySiteApi(localeFromPathname(path), appPageFromPathname(path));
    }

    componentDidUpdate(): void {
        const {siteApi, props: {path}} = this;

        const locale = localeFromPathname(path);
        if (locale !== siteApi.currentLocale) {
            siteApi.currentLocale = locale;
        }
    }

    render(): ReactNode {
        const {globalCss, ageWasmJsUrl, ageWasmUrl, siteApi, props} = this;
        const {children, path, pageContext: {pathPrefix}} = props;

        const locale = localeFromPathname(path);
        const currentPage = appPageFromPathname(path);

        return <>
            <AppHelmet basePath={pathPrefix}/>

            <SiteApiContext.Provider value={siteApi}>
                <AppContainer locale={locale}
                              currentPage={currentPage}
                              ageWasmJsUrl={ageWasmJsUrl}
                              ageWasmUrl={ageWasmUrl}
                              globalCss={globalCss}>
                    {children}
                </AppContainer>
            </SiteApiContext.Provider>
        </>;
    }
}

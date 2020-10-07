import {AppHelmet, getPathInfo, IPathInfo, SiteApi} from '@age-online/app-common';
import {SiteApiContext} from '@age-online/lib-react';
import {AppContainer} from '@age-online/lib-react-pages';
import {Link, navigate, PageProps, withPrefix} from 'gatsby';
import React, {Component, ReactNode} from 'react';


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
        '#___gatsby': {
            // mobile browsers:
            // let the element shrink/grow when showing/hiding the url bar
            // TODO does not always work (e.g. iOS Safari landscape mode)
            position: 'fixed',
            height: '100%',
            width: '100%',
        },
        '#___gatsby > div': {
            height: '100%',
        },
    };
    private readonly siteApi: SiteApi;

    constructor(props: TRootLayoutProps) {
        super(props);

        this.siteApi = new SiteApi(
            this.currentPathInfo().locale,
            toPath => void navigate(toPath),
            assetFile => withPrefix(assetFile),
            ({href, children}) => <Link to={href}>{children}</Link>,
        );
    }

    private currentPathInfo(): IPathInfo {
        // we call withPrefix('/') and remove the trailing slash
        // because withPrefix('') returns ''
        return getPathInfo(this.props.location.pathname, withPrefix('/'));
    }

    render(): ReactNode {
        // during build time props looked like this: { path: '/*', '*': 'age-online/<...>' }
        // which is why we rely on props.location.pathname instead
        const {globalCss, siteApi, props: {children, location: {pathname}}} = this;

        // Workaround for messed up rendering with gatsby-plugin-offline's app-shell:
        // the "home" page is never updated including it's nav-bar icon and
        // the emulator component is never shown when choosing a Gameboy rom
        // file to run.
        // See also: https://github.com/gatsbyjs/gatsby/issues/11738
        if (pathname.includes('offline-plugin-app-shell-fallback')) {
            return null;
        }

        const {basePath, locale, currentPage} = this.currentPathInfo();
        siteApi.currentLocale = locale;

        return <>
            <AppHelmet basePath={basePath}/>

            <SiteApiContext.Provider value={siteApi}>
                <AppContainer locale={locale}
                              currentPage={currentPage}
                              globalCss={globalCss}>
                    {children}
                </AppContainer>
            </SiteApiContext.Provider>
        </>;
    }
}

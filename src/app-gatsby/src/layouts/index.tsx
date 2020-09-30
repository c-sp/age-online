import {AppHelmet, appPageFromPathname, localeFromPathname, SiteApi} from '@age-online/app-common';
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
        const {path} = props;

        this.siteApi = new SiteApi(
            localeFromPathname(path),
            toPath => void navigate(toPath),
            assetFile => withPrefix(assetFile),
            ({href, children}) => <Link to={href}>{children}</Link>,
        );
    }

    render(): ReactNode {
        const {globalCss, siteApi, props} = this;
        const {children, path, pageContext: {pathPrefix}} = props;

        const locale = localeFromPathname(path);
        const currentPage = appPageFromPathname(path);
        siteApi.currentLocale = locale;

        return <>
            <AppHelmet basePath={pathPrefix}/>

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

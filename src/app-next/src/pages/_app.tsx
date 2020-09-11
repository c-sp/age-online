import {AppHelmet, appPageFromPathname, localeFromPathname} from '@age-online/app-common';
import {AppContainer, SiteApiContext,} from '@age-online/lib-gui-react';
import App from 'next/app';
import {AppProps} from 'next/dist/pages/_app';
import React, {ReactElement} from 'react';
import {NextSiteApi} from '../common';


export default class AgeOnlineApp extends App {

    private readonly globalCss = {
        '#__next': {
            height: '100%',
        }
    };
    private readonly ageWasmJsUrl: string;
    private readonly ageWasmUrl: string;
    private readonly siteApi: NextSiteApi;

    constructor(props: AppProps) {
        super(props);
        const {asPath, basePath} = props.router;

        this.ageWasmJsUrl = `${basePath}/age-wasm/age_wasm.js`;
        this.ageWasmUrl = `${basePath}/age-wasm/age_wasm.wasm`;

        this.siteApi = new NextSiteApi(localeFromPathname(asPath), appPageFromPathname(asPath));
    }

    componentDidUpdate(): void {
        const {siteApi, props: {router: {asPath}}} = this;

        const locale = localeFromPathname(asPath);
        if (locale !== siteApi.currentLocale) {
            siteApi.currentLocale = locale;
        }
    }

    render(): ReactElement {
        const {globalCss, ageWasmJsUrl, ageWasmUrl, siteApi, props} = this;
        const {Component, pageProps, router: {asPath, basePath}} = props;

        const locale = localeFromPathname(asPath);
        const currentPage = appPageFromPathname(asPath);

        return <>
            <AppHelmet basePath={basePath}/>

            <SiteApiContext.Provider value={siteApi}>
                <AppContainer locale={locale}
                              currentPage={currentPage}
                              ageWasmJsUrl={ageWasmJsUrl}
                              ageWasmUrl={ageWasmUrl}
                              globalCss={globalCss}>
                    <Component {...pageProps}/>
                </AppContainer>
            </SiteApiContext.Provider>
        </>;
    }
}

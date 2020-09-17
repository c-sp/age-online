import {AppHelmet, appPageFromPathname, localeFromPathname, SiteApi} from '@age-online/app-common';
import {AppContainer, SiteApiContext,} from '@age-online/lib-gui-react';
import App from 'next/app';
import {AppProps} from 'next/dist/pages/_app';
import Link from 'next/link';
import Router from 'next/router';
import React, {ReactElement} from 'react';


export default class AgeOnlineApp extends App {

    private readonly globalCss = {
        '#__next': {
            // mobile browsers:
            // let the element shrink/grow when showing/hiding the url bar
            position: 'fixed',
            height: '100%',
            width: '100%',
        }
    };
    private readonly ageWasmJsUrl: string;
    private readonly ageWasmUrl: string;
    private readonly siteApi: SiteApi;

    constructor(props: AppProps) {
        super(props);
        const {asPath, basePath} = props.router;

        this.ageWasmJsUrl = `${basePath}/age-wasm/age_wasm.js`;
        this.ageWasmUrl = `${basePath}/age-wasm/age_wasm.wasm`;

        this.siteApi = new SiteApi(
            localeFromPathname(asPath),
            path => Router.push(path),
            ({href, children}) => <Link href={href} prefetch={false}><a>{children}</a></Link>,
        );
    }

    render(): ReactElement {
        const {globalCss, ageWasmJsUrl, ageWasmUrl, siteApi, props} = this;
        const {Component, pageProps, router: {asPath, basePath}} = props;

        const locale = localeFromPathname(asPath);
        const currentPage = appPageFromPathname(asPath);
        siteApi.currentLocale = locale;

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

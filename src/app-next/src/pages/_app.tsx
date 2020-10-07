import {AppHelmet, getPathInfo, IPathInfo, SiteApi} from '@age-online/app-common';
import {SiteApiContext} from '@age-online/lib-react';
import {AppContainer} from '@age-online/lib-react-pages';
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
            // TODO does not always work (e.g. iOS Safari landscape mode)
            position: 'fixed',
            height: '100%',
            width: '100%',
        },
    };
    private readonly siteApi: SiteApi;

    constructor(props: AppProps) {
        super(props);
        const {basePath} = props.router;

        this.siteApi = new SiteApi(
            this.currentPathInfo().locale,
            path => void Router.push(path),
            assetFile => `${basePath}/${assetFile}`,
            ({href, children}) => <Link href={href} prefetch={false}><a>{children}</a></Link>,
        );
    }

    private currentPathInfo(): IPathInfo {
        const {asPath, basePath} = this.props.router;
        return getPathInfo(asPath, basePath);
    }

    render(): ReactElement {
        const {globalCss, siteApi, props} = this;
        const {Component} = props;
        const {basePath, locale, currentPage} = this.currentPathInfo();

        siteApi.currentLocale = locale;

        return <>
            <AppHelmet basePath={basePath}/>

            <SiteApiContext.Provider value={siteApi}>
                <AppContainer locale={locale}
                              currentPage={currentPage}
                              globalCss={globalCss}>
                    <Component {...props.pageProps}/>
                </AppContainer>
            </SiteApiContext.Provider>
        </>;
    }
}

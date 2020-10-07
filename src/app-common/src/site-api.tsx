import React, {FunctionComponent, ReactElement} from 'react';
import {
    AppPage,
    FALLBACK_LOCALE,
    isAppPage,
    ISiteApi,
    ISiteLinkProps,
    isLocale,
    Locale,
    TSiteLinkComponent,
} from '@age-online/lib-react';


export class SiteApi implements ISiteApi {

    readonly SiteLink: TSiteLinkComponent;

    constructor(public currentLocale: Locale,
                private readonly navigateTo: (path: string) => void,
                private readonly getAssetUrl: (assetFile: string) => string,
                Link: FunctionComponent<{ href: string }>) {

        this.SiteLink = (props: ISiteLinkProps): ReactElement => {
            const {appPage, locale, children} = props;
            // TODO this may not work, if the returned component is not part of a
            //      component wrapped with withI18nBundle()
            //      (this may get interesting when "interrupting" rendering the
            //      component tree with a pure component)
            return <Link href={this.localizePath(appPage, locale)}>{children}</Link>;
        };
    }

    navigateLocalized(appPage: AppPage, locale?: Locale): void {
        this.navigateTo(this.localizePath(appPage, locale));
    }

    assetUrl(assetFile: string): string {
        return this.getAssetUrl(assetFile.startsWith('/') ? assetFile : `/${assetFile}`);
    }

    private localizePath(path: string, locale?: Locale): string {
        const checkedPath = path.startsWith('/') ? path : `/${path}`;
        return `/${locale ?? this.currentLocale}${checkedPath}`;
    }
}


export interface IPathInfo {
    readonly basePath: string;
    readonly locale: Locale;
    readonly currentPage?: AppPage;
}

export function getPathInfo(pathname: string, pathPrefix: string): IPathInfo {
    const basePath = pathPrefix.replace(/\/$/u, ''); // remove trailing slash

    // '/de/foo' => ['', 'de', 'foo'] => ['de', 'foo']
    // '/foo' => ['', 'foo'] => ['foo']
    const pathParts = (pathname.startsWith(basePath) ? pathname.substring(basePath.length) : pathname)
        .replace(/\/$/u, '') // remove trailing slash
        .split('/')
        .slice(1);

    const [pathLocale] = pathParts;
    const locale = isLocale(pathLocale) ? pathLocale : FALLBACK_LOCALE;

    const pathAppPage = isLocale(pathLocale) ? pathParts[1] : pathParts[0];
    const appPageStr = `/${pathAppPage ?? ''}`;
    const currentPage = isAppPage(appPageStr) ? appPageStr : undefined;

    return {basePath, locale, currentPage};
}

import {AppPage, isAppPage, ISiteApi, ISiteLinkProps, TSiteLinkComponent} from '@age-online/lib-react-pages';
import React, {FunctionComponent, ReactElement} from 'react';
import {FALLBACK_LOCALE, isLocale, Locale} from '@age-online/lib-react';


export class SiteApi implements ISiteApi {

    readonly SiteLink: TSiteLinkComponent;

    constructor(public currentLocale: Locale,
                private readonly navigateTo: (path: string) => void,
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

    private localizePath(path: string, locale?: Locale): string {
        const checkedPath = path.startsWith('/') ? path : `/${path}`;
        return `/${locale ?? this.currentLocale}${checkedPath}`;
    }
}


export function localeFromPathname(pathname: string): Locale {
    const [locale] = splitPathname(pathname);
    return isLocale(locale) ? locale : FALLBACK_LOCALE;
}

export function appPageFromPathname(pathname: string): AppPage {
    // ['en', 'foo'] => ['foo']
    // ['xy', 'foo'] => ['xy', 'foo']
    const pathParts = splitPathname(pathname);
    const pagePath = isLocale(pathParts[0]) ? pathParts.slice(1) : pathParts;

    const appPageStr = `/${pagePath[0]}`;
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

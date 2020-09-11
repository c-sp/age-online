import {AppPage, FALLBACK_LOCALE, isAppPage, isLocale, Locale} from '@age-online/lib-gui-react';

export * from './app-helmet';


export function localeFromPathname(pathname: string): Locale {
    const [locale] = splitPathname(pathname);
    return isLocale(locale) ? locale : FALLBACK_LOCALE;
}

export function appPageFromPathname(pathname: string): AppPage {
    const pathParts = splitPathname(pathname);
    // ['en', 'foo'] => ['foo']
    // ['xy', 'foo'] => ['xy', 'foo']
    const appPageStr = `/${isLocale(pathParts[0]) ? pathParts.slice(1) : pathParts}`;
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

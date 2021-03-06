import {Locale} from '../i18n';
import {FunctionComponent, ReactNode} from 'react';


export enum AppPage {
    HOME = '/',
    SETTINGS = '/settings',
    ABOUT = '/about',
}

export function isAppPage(value: unknown): value is AppPage {
    return (typeof value === 'string') && Object.values(AppPage).includes(value as AppPage);
}


export interface ISiteLinkProps {
    readonly appPage: AppPage;
    readonly locale?: Locale;
    readonly children?: ReactNode;
}

export type TSiteLinkComponent = FunctionComponent<ISiteLinkProps>;


/**
 * `ISiteApi` abstracts the site generator's API
 * (e.g. Gatsby or Next.js).
 *
 * Components using the `ISiteApi` thus don't have to know any details about
 * the actual static site generator e.g. for navigation.
 */
export interface ISiteApi {

    /**
     * Site link component based on the current locale
     */
    readonly SiteLink: TSiteLinkComponent;

    /**
     * Navigate to the specified page using the specified locale.
     * If no locale is specified, the current locale is used.
     */
    navigateLocalized(appPage: AppPage, locale?: Locale): void;

    assetUrl(assetFile: string): string;
}

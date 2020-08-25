import {FunctionComponent, ReactNode} from 'react';
import {TLocale} from '../i18n';


export enum AppPage {
    HOME = '/',
    HELP = '/help',
    SETTINGS = '/settings',
}


export interface ISiteLinkProps {
    readonly appPage: AppPage;
    readonly locale?: TLocale;
    readonly className?: string;
    readonly children?: ReactNode;
}

export type TSiteLinkComponent = FunctionComponent<ISiteLinkProps>;


export interface ISiteApi {

    /**
     * Site link component based on the current locale
     */
    readonly SiteLink: TSiteLinkComponent;

    /**
     * Navigate to the specified page using the specified locale.
     * If no locale is specified, the current locale is used.
     */
    navigateLocalized(appPage: AppPage, locale?: TLocale): void;
}

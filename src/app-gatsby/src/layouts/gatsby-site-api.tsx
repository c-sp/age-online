import {AppPage, ISiteApi, ISiteLinkProps, Locale} from '@age-online/lib-gui-react';
import {Link, navigate} from 'gatsby';
import React, {ReactElement} from 'react';


export class GatsbySiteApi implements ISiteApi {

    readonly SiteLink = (props: ISiteLinkProps): ReactElement => {
        const {appPage, locale, children, className} = props;
        const classProp = className ? {className} : {};
        // TODO this may not work, if the returned component is not part of a
        //      component wrapped with withI18nBundle()
        //      (this may get interesting when "interrupting" rendering the
        //      component tree with a pure component)
        return <Link to={this.localizePath(appPage, locale)} {...classProp}>{children}</Link>;
    };

    constructor(private currentLocale: Locale) {
    }

    setCurrentLocale(currentLocale: Locale): void {
        this.currentLocale = currentLocale;
    }

    /** @inheritDoc */
    navigateLocalized(appPage: AppPage, locale?: Locale): void {
        navigateTo(this.localizePath(appPage, locale));
    }

    private localizePath(path: string, locale?: Locale): string {
        const checkedPath = path.startsWith('/') ? path : `/${path}`;
        return `/${locale ?? this.currentLocale}${checkedPath}`;
    }
}


function navigateTo(pathname: string): void {
    void navigate(pathname);
}

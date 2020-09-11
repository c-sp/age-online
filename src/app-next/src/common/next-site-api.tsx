import {AppPage, ISiteApi, ISiteLinkProps, Locale} from '@age-online/lib-gui-react';
import Link from 'next/link';
import Router from 'next/router';
import React, {ReactElement} from 'react';


export class NextSiteApi implements ISiteApi {

    readonly SiteLink = (props: ISiteLinkProps): ReactElement => {
        const {appPage, locale, children} = props;
        // TODO this may not work, if the returned component is not part of a
        //      component wrapped with withI18nBundle()
        //      (this may get interesting when "interrupting" rendering the
        //      component tree with a pure component)
        return <Link href={this.localizePath(appPage, locale)} prefetch={false}><a>{children}</a></Link>;
    };

    constructor(public currentLocale: Locale,
                public currentPage: AppPage) {
    }

    /** @inheritDoc */
    navigateLocalized(appPage: AppPage, locale?: Locale): void {
        Router.push(this.localizePath(appPage, locale));
    }

    private localizePath(path: string, locale?: Locale): string {
        const checkedPath = path.startsWith('/') ? path : `/${path}`;
        return `/${locale ?? this.currentLocale}${checkedPath}`;
    }
}

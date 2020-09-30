import React, {ComponentType, createContext, ReactElement} from 'react';
import {AppPage, ISiteApi} from './site-api';


class NoSiteApi implements ISiteApi {

    readonly currentPage = AppPage.HOME;

    readonly SiteLink = function EmptyLink(): ReactElement {
        return <></>;
    };

    readonly ageWasmJsUrl = '';
    readonly ageWasmUrl = '';

    navigateLocalized(): void {
        throw new Error('site api not implemented');
    }

    assetUrl(): string {
        throw new Error('site api not implemented');
    }
}


export const SiteApiContext = createContext<ISiteApi>(new NoSiteApi());

export interface ISiteApiProps {
    readonly siteApi: ISiteApi;
}

export function withSiteApi<P>(Wrapped: ComponentType<P & ISiteApiProps>): ComponentType<P> {
    return function WithSiteApi(props: P): ReactElement {
        return (
            <SiteApiContext.Consumer>{
                (value): ReactElement => <Wrapped siteApi={value} {...props}/>
            }</SiteApiContext.Consumer>
        );
    };
}

import React, {ComponentType, createContext, ReactElement} from 'react';
import {ISiteApi} from './site-api';


class NoSiteApi implements ISiteApi {

    readonly SiteLink = function EmptyLink(): ReactElement {
        return <></>;
    };

    navigateLocalized(): void {
        throw new Error('site api not implemented');
    }
}


export const SiteApiContext = createContext<ISiteApi>(new NoSiteApi());

export interface IWithSiteApiProps {
    readonly siteApi: ISiteApi;
}

export function withSiteApi<P>(WrappedComponent: ComponentType<P & IWithSiteApiProps>): ComponentType<P> {
    return function WithSiteApi(props: P): ReactElement {
        return (
            <SiteApiContext.Consumer>{
                (value): JSX.Element => <WrappedComponent siteApi={value} {...props}/>
            }</SiteApiContext.Consumer>
        );
    };
}

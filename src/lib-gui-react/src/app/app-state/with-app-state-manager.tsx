import React, {ComponentType, createContext, ReactElement} from 'react';
import {AppStateManager} from './app-state-manager';


export const AppStateManagerContext = createContext<AppStateManager>(new AppStateManager());

export interface IAppStateManagerProps {
    readonly appStateManager: AppStateManager;
}

export function withAppStateManager<P>(WrappedComponent: ComponentType<P & IAppStateManagerProps>): ComponentType<P> {
    return (props: P): ReactElement => (
        <AppStateManagerContext.Consumer>{
            (value): JSX.Element => <WrappedComponent appStateManager={value} {...props}/>
        }</AppStateManagerContext.Consumer>
    );
}

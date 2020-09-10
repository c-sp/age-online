import React, {ComponentType, createContext, ReactElement} from 'react';
import {ICurrentAppState, IPersistentAppState} from './app-state';
import {PersistentAppState} from './persistent-app-state';


export interface ICurrentAppStateProps {
    readonly currentAppState: ICurrentAppState;
}

export interface IPersistentAppStateProps extends ICurrentAppStateProps {
    readonly persistentAppState: IPersistentAppState;
}


export const AppStateContext = createContext<PersistentAppState>(new PersistentAppState());

export function withCurrentAppState<P>(WrappedComponent: ComponentType<P & ICurrentAppStateProps>): ComponentType<P> {
    return (props: P): ReactElement => (
        <AppStateContext.Consumer>{
            (value): ReactElement => <WrappedComponent currentAppState={value} {...props}/>
        }</AppStateContext.Consumer>
    );
}

export function withPersistentAppState<P>(WrappedComponent: ComponentType<P & IPersistentAppStateProps>): ComponentType<P> {
    return (props: P): ReactElement => (
        <AppStateContext.Consumer>{
            (value): ReactElement => <WrappedComponent currentAppState={value} persistentAppState={value} {...props}/>
        }</AppStateContext.Consumer>
    );
}

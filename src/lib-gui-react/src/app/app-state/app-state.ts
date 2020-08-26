import {AppPage} from '../../components';


export interface IAppState {
    readonly currentPage: AppPage;
}


export type TAppStateKey = keyof IAppState;

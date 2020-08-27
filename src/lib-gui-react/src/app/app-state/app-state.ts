import {Theme} from '@material-ui/core';
import {AppPage, ThemePreference} from '../../components';


export interface IAppState {
    readonly currentPage: AppPage;
    readonly themePreference: ThemePreference;
    readonly currentTheme: Theme;
}


export type TAppStateKey = keyof IAppState;

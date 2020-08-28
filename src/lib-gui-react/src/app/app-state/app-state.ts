import {Theme} from '@material-ui/core';
import {Observable} from 'rxjs';
import {AppPage, Locale, PreferredTheme} from '../../components';


export interface IAppState {
    readonly currentPage: AppPage;

    /**
     * The user's preferred locale is not necessarily equal to the current
     * locale (predefined by pathname).
     */
    readonly preferredLocale: Locale;

    /**
     * the user's preferred theme
     */
    readonly preferredTheme: PreferredTheme;

    /**
     * The current theme is derived from {@link preferredTheme} and the current
     * system theme settings via `prefers-color-scheme` media query
     * (if available).
     */
    readonly currentTheme: Theme;
}

export type TAppStateKey = keyof IAppState;


export interface ICurrentAppState {
    readonly appState: IAppState;

    appState$(...relevantAppStateKeys: ReadonlyArray<TAppStateKey>): Observable<IAppState>;
}


export interface IPersistentAppState extends ICurrentAppState {
    setCurrentPage(currentPage: AppPage): void;

    setPreferredLocale(locale: Locale): void;

    setPreferredTheme(preferredTheme: PreferredTheme): void;
}

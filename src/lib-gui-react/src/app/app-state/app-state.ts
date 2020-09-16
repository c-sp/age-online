import {TGameboyRomSource} from '@age-online/lib-emulator';
import {Theme} from '@material-ui/core';
import {Observable} from 'rxjs';
import {DisplayControls, EmulatorState, Locale, PreferredTheme} from '../../components';


export interface IAppState {
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

    readonly romSource: TGameboyRomSource | null;

    readonly emulatorState: EmulatorState;

    readonly displayControls: DisplayControls;
}

export type TAppStateKey = keyof IAppState;


export interface ICurrentAppState {
    readonly appState: IAppState;

    appState$(...relevantAppStateKeys: ReadonlyArray<TAppStateKey>): Observable<IAppState>;
}


export interface IPersistentAppState extends ICurrentAppState {
    setPreferredLocale(locale: IAppState['preferredLocale']): void;

    setPreferredTheme(preferredTheme: IAppState['preferredTheme']): void;

    setRomSource(romFile: IAppState['romSource']): void;

    setEmulatorState(emulatorState: IAppState['emulatorState']): void;

    setDisplayControls(displayControls: IAppState['displayControls']): void;
}

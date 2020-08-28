import {AppPage, isPreferredTheme, Locale, PreferredTheme} from '../../components';
import {IAppState, IPersistentAppState} from './app-state';
import {CurrentAppState} from './current-app-state';
import {LocalStorage} from './local-storage';


const KEY_PREFERRED_LOCALE = 'settings:preferred-locale';
const KEY_PREFERRED_THEME = 'settings:preferred-theme';


export class PersistentAppState extends CurrentAppState implements IPersistentAppState {

    private readonly store = new LocalStorage();
    private preferDarkTheme = false;

    constructor(globalCss?: object) {
        super(globalCss);
        this.updateState(this.readFromStore());

        if (typeof window !== 'undefined') {
            const onChangePreferDark = ({matches}: MediaQueryListEvent | MediaQueryList): void => {
                this.preferDarkTheme = matches;
                this.setPreferredTheme(this.appState.preferredTheme);
            };

            const preferDarkMQL = window.matchMedia('(prefers-color-scheme: dark)');
            // not supported by Safari 13.1:
            // preferDarkMQL.addEventListener('change', onChangePreferDark);
            preferDarkMQL.addListener(onChangePreferDark);

            this.callOnCleanup(
                // not supported by Safari 13.1:
                // () => preferDarkMQL.removeEventListener('change', onChangePreferDark),
                () => preferDarkMQL.removeListener(onChangePreferDark),
            );

            // initialize theme
            onChangePreferDark(preferDarkMQL);
        }
    }


    setCurrentPage(currentPage: AppPage): void {
        if (currentPage !== this.appState.currentPage) {
            this.updateState({currentPage});
        }
    }


    setPreferredLocale(preferredLocale: Locale): void {
        this.store.setItem(KEY_PREFERRED_LOCALE, preferredLocale);
        if (preferredLocale !== this.appState.preferredLocale) {
            this.updateState({preferredLocale});
        }
    }


    setPreferredTheme(preferredTheme: PreferredTheme): void {
        this.store.setItem(KEY_PREFERRED_THEME, preferredTheme);

        const {lightTheme, darkTheme, preferDarkTheme} = this;
        const {AUTO_DETECT, DARK} = PreferredTheme;
        const newTheme = (preferredTheme === DARK) || ((preferredTheme === AUTO_DETECT) && preferDarkTheme)
            ? darkTheme
            : lightTheme;

        const {appState} = this;
        if ((newTheme !== appState.currentTheme) || (preferredTheme !== appState.preferredTheme)) {
            this.updateState({preferredTheme, currentTheme: newTheme});
        }
    }


    private readFromStore(): Partial<IAppState> {
        const prefTheme = this.store.getItem(KEY_PREFERRED_THEME);
        const preferredTheme = isPreferredTheme(prefTheme) ? prefTheme : PreferredTheme.AUTO_DETECT;
        return {preferredTheme};
    }
}

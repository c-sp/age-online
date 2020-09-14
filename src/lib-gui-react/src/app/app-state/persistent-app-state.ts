import {EmulatorControls, isEmulatorControls, isPreferredTheme, PreferredTheme} from '../../components';
import {IAppState, IPersistentAppState} from './app-state';
import {CurrentAppState} from './current-app-state';
import {LocalStorage} from './local-storage';


const KEY_PREFERRED_LOCALE = 'preferred-locale';
const KEY_PREFERRED_THEME = 'preferred-theme';
const KEY_EMULATOR_CONTROLS = 'emulator-controls';


export class PersistentAppState extends CurrentAppState implements IPersistentAppState {

    private readonly store = new LocalStorage('age-online');
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


    setPreferredLocale(preferredLocale: IAppState['preferredLocale']): void {
        this.store.setItem(KEY_PREFERRED_LOCALE, preferredLocale);
        if (preferredLocale !== this.appState.preferredLocale) {
            this.updateState({preferredLocale});
        }
    }


    setPreferredTheme(preferredTheme: IAppState['preferredTheme']): void {
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


    setRomSource(romSource: IAppState['romSource']): void {
        this.updateState({romSource});
    }

    setEmulatorState(emulatorState: IAppState['emulatorState']): void {
        this.updateState({emulatorState});
    }

    setEmulatorControls(emulatorControls: IAppState['emulatorControls']): void {
        this.store.setItem(KEY_EMULATOR_CONTROLS, `${emulatorControls}`);
        this.updateState({emulatorControls});
    }


    private readFromStore(): Partial<IAppState> {
        const prefTheme = this.store.getItem(KEY_PREFERRED_THEME);
        const preferredTheme = isPreferredTheme(prefTheme) ? prefTheme : PreferredTheme.AUTO_DETECT;

        const emuControls = this.store.getItem(KEY_EMULATOR_CONTROLS);
        const emulatorControls = isEmulatorControls(emuControls) ? emuControls : EmulatorControls.VISIBLE;

        return {preferredTheme, emulatorControls};
    }
}

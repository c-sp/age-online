import {isPreferredTheme, PreferredTheme} from '../../components';
import {IAppState, IPersistentAppState} from './app-state';
import {CurrentAppState} from './current-app-state';
import {LocalStorage} from './local-storage';
import {DisplayControls, isDisplayControls} from '@age-online/lib-react-emulator';


const KEY_PREFERRED_LOCALE = 'preferred-locale';
const KEY_PREFERRED_THEME = 'preferred-theme';
const KEY_DISPLAY_CONTROLS = 'display-controls';


export class PersistentAppState extends CurrentAppState implements IPersistentAppState {

    private readonly store = new LocalStorage('age-online');
    private preferLightTheme = false;

    constructor(globalCss?: object) {
        super(globalCss);
        this.updateState(this.readFromStore());

        if (typeof window !== 'undefined') {
            const onChangePreferLight = ({matches}: MediaQueryListEvent | MediaQueryList): void => {
                this.preferLightTheme = matches;
                this.setPreferredTheme(this.appState.preferredTheme);
            };

            const preferLightMQL = window.matchMedia('(prefers-color-scheme: light)');
            // not supported by Safari 13.1:
            // preferLightMQL.addEventListener('change', onChangePreferLight);
            preferLightMQL.addListener(onChangePreferLight);

            this.callOnCleanup(
                // not supported by Safari 13.1:
                // () => preferLightMQL.removeEventListener('change', onChangePreferLight),
                () => preferLightMQL.removeListener(onChangePreferLight),
            );

            // initialize theme
            onChangePreferLight(preferLightMQL);
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

        const {lightTheme, darkTheme, preferLightTheme} = this;
        const {AUTO_DETECT, LIGHT} = PreferredTheme;
        const newTheme = (preferredTheme === LIGHT) || ((preferredTheme === AUTO_DETECT) && preferLightTheme)
            ? lightTheme
            : darkTheme;

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

    setDisplayControls(displayControls: IAppState['displayControls']): void {
        this.store.setItem(KEY_DISPLAY_CONTROLS, `${displayControls}`);
        this.updateState({displayControls});
    }


    private readFromStore(): Pick<IAppState, 'preferredTheme' | 'displayControls'> {
        const prefTheme = this.store.getItem(KEY_PREFERRED_THEME);
        const preferredTheme = isPreferredTheme(prefTheme) ? prefTheme : PreferredTheme.AUTO_DETECT;

        const emuControls = this.store.getItem(KEY_DISPLAY_CONTROLS);
        const displayControls = isDisplayControls(emuControls) ? emuControls : DisplayControls.VISIBLE_OVERLAY;

        return {preferredTheme, displayControls};
    }
}

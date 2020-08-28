import {Unsubscriber} from '@age-online/lib-common';
import {Theme} from '@material-ui/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, map, startWith} from 'rxjs/operators';
import {AppPage, createTheme, Locale, PreferredTheme} from '../../components';
import {IAppState, ICurrentAppState, TAppStateKey} from './app-state';


export class CurrentAppState extends Unsubscriber implements ICurrentAppState {

    protected readonly lightTheme: Theme;
    protected readonly darkTheme: Theme;

    private readonly appStateSubject: BehaviorSubject<[
        updatedKeys: ReadonlyArray<string>,
        updatedState: IAppState,
    ]>;

    constructor(globalCss?: object) {
        super();

        this.lightTheme = createTheme(globalCss);
        this.darkTheme = createTheme(globalCss, {
            palette: {
                primary: {
                    main: '#708dff',
                },
                type: 'dark',
            },
        });

        this.appStateSubject = new BehaviorSubject<[
            updatedKeys: ReadonlyArray<string>,
            updatedState: IAppState,
        ]>([[], {
            currentPage: AppPage.HOME,
            preferredLocale: Locale.EN,
            preferredTheme: PreferredTheme.AUTO_DETECT,
            currentTheme: this.lightTheme,
        }]);
    }


    get appState(): IAppState {
        return this.appStateSubject.value[1];
    }

    appState$(...relevantAppStateKeys: ReadonlyArray<TAppStateKey>): Observable<IAppState> {
        const {appStateSubject} = this;
        const keySet = new Set<string>(relevantAppStateKeys);

        return appStateSubject.asObservable().pipe(
            filter((val) => !keySet.size || val[0].some((key) => keySet.has(key))),
            map((val) => val[1]),
            // the current state is emitted regardless of any key filter
            startWith(appStateSubject.value[1]),
        );
    }


    protected updateState(newState: Partial<IAppState>): void {
        const updatedState = {...this.appState};
        const updatedKeys = new Array<string>();

        Object.keys(updatedState).forEach((k) => {
            // Partial<IAppState> allows explicitly setting properties to
            // undefined which contradicts their original app-state-type:
            //
            // e.g. updateState({currentTheme: undefined})
            //
            // We thus filter undefined values.

            const key = k as keyof IAppState;
            const value = newState[key];

            if (value !== undefined) {
                updatedKeys.push(key);
                (updatedState as any)[key] = value;
            }
        });

        if (updatedKeys.length) {
            this.appStateSubject.next([updatedKeys, updatedState]);
        }
    }
}

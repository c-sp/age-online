import {createStyles, Paper, WithStyles, withStyles} from '@material-ui/core';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {ReactNode} from 'react';
import {SEO, ThemePreference, ThemeSelection, TidyComponent, withI18nBundle} from '../../components';
import {IAppStateManagerProps, withAppStateManager} from '../app-state';
import i18nBundle from './settings-page.i18n.json';


const styles = createStyles({
    main: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
});

interface ISettingsPageState {
    readonly themePreference: ThemePreference;
}

type TSettingsPageProps = WithStyles & WithI18nProps & IAppStateManagerProps;

class ComposedSettingsPage extends TidyComponent<TSettingsPageProps, ISettingsPageState> {

    constructor(props: TSettingsPageProps) {
        super(props);
        const {themePreference} = props.appStateManager.appState
        this.state = {themePreference};
    }

    componentDidMount(): void {
        this.unsubscribeOnUnmount(
            this.props.appStateManager.appState$('themePreference').subscribe(
                ({themePreference}) => this.setState({themePreference}),
            ),
        );
    }

    render(): ReactNode {
        const {props: {classes, i18n, appStateManager}, state: {themePreference}} = this;

        return (
            <Paper component={'main'} className={classes.main} elevation={0}>
                <SEO i18n={i18n}/>
                <h1>{i18n.translate('page:heading')}</h1>

                <ThemeSelection themePreference={themePreference}
                                preferTheme={(themePreference: ThemePreference) => {
                                    appStateManager.setThemePreference(themePreference);
                                }}/>

            </Paper>
        );
    }
}


export const SettingsPage = withI18nBundle('settings-page', i18nBundle)(
    withStyles(styles)(
        withAppStateManager(
            ComposedSettingsPage,
        ),
    ),
);

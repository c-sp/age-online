import {createStyles, Paper, Typography, WithStyles, withStyles} from '@material-ui/core';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {ReactNode} from 'react';
import {
    AppPage,
    ISiteApiProps,
    LocaleSelection,
    SEO,
    ThemePreference,
    ThemeSelection,
    TidyComponent,
    withI18nBundle,
    withSiteApi,
} from '../../components';
import {IAppStateManagerProps, withAppStateManager} from '../app-state';
import i18nBundle from './settings-page.i18n.json';
import {EXTERNAL_LINK_PROPS} from "@age-online/lib-common";


const HREF_FREEPIK = 'https://www.flaticon.com/authors/freepik';
const HREF_FLATICON = 'https://www.flaticon.com/packs/countrys-flags';


const styles = createStyles({
    main: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        '& > :nth-child(n+2)': {
            marginTop: '2em',
        },

        '& > :last-child': {
            marginTop: '3em',
        },
    },
});

interface ISettingsPageState {
    readonly themePreference: ThemePreference;
}

type TSettingsPageProps = WithStyles & WithI18nProps & IAppStateManagerProps & ISiteApiProps;

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
        const {props: {classes, i18n, appStateManager, siteApi}, state: {themePreference}} = this;

        return (
            <Paper component={'main'} className={classes.main} elevation={0}>
                <SEO i18n={i18n}/>
                <h1>{i18n.translate('page:heading')}</h1>

                <LocaleSelection selectedLocale={i18n.locale}
                                 onSelect={(locale): void => {
                                     siteApi.navigateLocalized(AppPage.SETTINGS, locale);
                                     // TODO LOCAL_STORAGE.setPreferredLocale(locale);
                                 }}
                                 color="primary"/>

                <ThemeSelection themePreference={themePreference}
                                preferTheme={(themePreference: ThemePreference) => {
                                    appStateManager.setThemePreference(themePreference);
                                }}/>

                <div className={classes.flagHint}>
                    <Typography variant="caption"
                                color="textSecondary">
                        {i18n.translate(
                            'flag-hint',
                            {
                                LinkFreepik: <a href={HREF_FREEPIK} {...EXTERNAL_LINK_PROPS}>Freepik</a>,
                                LinkFlaticon: <a href={HREF_FLATICON} {...EXTERNAL_LINK_PROPS}>www.flaticon.com</a>,
                            },
                        )}
                    </Typography>
                </div>

            </Paper>
        );
    }
}


export const SettingsPage = withI18nBundle('settings-page', i18nBundle)(
    withStyles(styles)(
        withAppStateManager(
            withSiteApi(
                ComposedSettingsPage,
            ),
        ),
    ),
);

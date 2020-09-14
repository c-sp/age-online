import {createStyles, Paper, Typography, WithStyles, withStyles} from '@material-ui/core';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {ReactNode} from 'react';
import {
    AppPage,
    EXTERNAL_LINK_PROPS,
    ISiteApiProps,
    LocaleSelection,
    PreferredTheme,
    SEO,
    ThemeSelection,
    TidyPureComponent,
    withI18nBundle,
    withSiteApi,
} from '../../components';
import {IPersistentAppStateProps, withPersistentAppState} from '../app-state';
import i18nBundle from './settings-page.i18n.json';


const HREF_FREEPIK = 'https://www.flaticon.com/authors/freepik';
const HREF_FLATICON = 'https://www.flaticon.com/packs/countrys-flags';


const styles = (theme: Theme) => createStyles({
    main: {
        minHeight: '100%', // extend <Paper> style to the page's bottom
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        '& > :nth-child(n+2)': {
            marginTop: theme.spacing(3),
        },

        // flag hint
        '& > :last-child': {
            marginTop: theme.spacing(7),
            textAlign: 'center',
        },
    },
});

interface ISettingsPageState {
    readonly preferredTheme: PreferredTheme;
}

type TSettingsPageProps = WithStyles & WithI18nProps & ISiteApiProps & IPersistentAppStateProps;

class ComposedSettingsPage extends TidyPureComponent<TSettingsPageProps, ISettingsPageState> {

    constructor(props: TSettingsPageProps) {
        super(props);
        const {preferredTheme} = props.currentAppState.appState
        this.state = {preferredTheme};
    }

    componentDidMount(): void {
        this.unsubscribeOnUnmount(
            this.props.currentAppState.appState$('preferredTheme').subscribe(
                ({preferredTheme}) => this.setState({preferredTheme}),
            ),
        );
    }

    render(): ReactNode {
        const {props: {classes, i18n, persistentAppState, siteApi}, state: {preferredTheme}} = this;

        return (
            <Paper component={'main'} className={classes.main} elevation={0}>
                <SEO i18n={i18n}/>
                <h1>{i18n.translate('page:heading')}</h1>

                <LocaleSelection selectedLocale={i18n.locale}
                                 onSelect={(locale): void => {
                                     persistentAppState.setPreferredLocale(locale);
                                     siteApi.navigateLocalized(AppPage.SETTINGS, locale);
                                 }}
                                 color="primary"/>

                <ThemeSelection preferredTheme={preferredTheme}
                                preferTheme={(themePreference: PreferredTheme) => {
                                    persistentAppState.setPreferredTheme(themePreference);
                                }}/>

                <Typography component={'div'}
                            color="textSecondary"
                            variant="caption">
                    <p>{i18n.translate(
                        'flag-hint',
                        {
                            LinkFreepik: <a href={HREF_FREEPIK} {...EXTERNAL_LINK_PROPS}>Freepik</a>,
                            LinkFlaticon: <a href={HREF_FLATICON} {...EXTERNAL_LINK_PROPS}>www.flaticon.com</a>,
                        },
                    )}</p>
                </Typography>

            </Paper>
        );
    }
}


export const SettingsPage = withI18nBundle('settings-page', i18nBundle)(
    withStyles(styles)(
        withSiteApi(
            withPersistentAppState(
                ComposedSettingsPage,
            ),
        ),
    ),
);

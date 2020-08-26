import {createStyles, Paper, WithStyles, withStyles} from '@material-ui/core';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, ReactNode} from 'react';
import {
    AppPage,
    COMMON_I18N_REPLACEMENTS,
    ISiteApiProps,
    LOCALE_DE,
    LOCALE_EN,
    SEO,
    withI18nBundle,
    withSiteApi,
} from '../../components';
import i18nBundle from './page-home.i18n.json';


const styles = createStyles({
    main: {
        textAlign: 'center',
    },
});

type TPageHomeProps = WithStyles & WithI18nProps & ISiteApiProps;

class ComposedPageHome extends Component<TPageHomeProps> {

    render(): ReactNode {
        const {classes, i18n, siteApi: {SiteLink}} = this.props;

        return <Paper elevation={0}>
            <SEO i18n={i18n}/>

            <main className={classes.main}>
                <SiteLink appPage={AppPage.HOME} locale={LOCALE_DE}>{LOCALE_DE} </SiteLink>
                <SiteLink appPage={AppPage.HOME} locale={LOCALE_EN}>{LOCALE_EN} </SiteLink>

                <h1>{i18n.translate('page:heading')}</h1>
                {i18n.translate('page:text', COMMON_I18N_REPLACEMENTS)}
            </main>

        </Paper>;
    }
}


export const PageHome = withI18nBundle('page-home', i18nBundle)(
    withStyles(styles)(
        withSiteApi(
            ComposedPageHome,
        ),
    ),
);

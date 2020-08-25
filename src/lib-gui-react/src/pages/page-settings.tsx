import {createStyles, WithStyles, withStyles} from '@material-ui/core';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, ReactNode} from 'react';
import {SEO, withI18nBundle} from '../components';
import i18nBundle from './page-settings.i18n.json';


const styles = createStyles({
    main: {
        textAlign: 'center',
    },
});

type TPageSettingsProps = WithStyles & WithI18nProps;

class ComposedPageSettings extends Component<TPageSettingsProps> {

    render(): ReactNode {
        const {classes, i18n} = this.props;

        return (
            <main className={classes.main}>
                <SEO i18n={i18n}/>
                <h1>{i18n.translate('page:heading')}</h1>
            </main>
        );
    }
}


export const PageSettings = withI18nBundle('page-settings', i18nBundle)(
    withStyles(styles)(
        ComposedPageSettings,
    ),
);

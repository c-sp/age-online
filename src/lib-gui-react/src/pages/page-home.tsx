/*
 * Copyright Christoph Sprenger - All Rights Reserved
 * Proprietary and confidential
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
import {createStyles, WithStyles, withStyles} from '@material-ui/core';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, ReactNode} from 'react';
import {COMMON_I18N_REPLACEMENTS, SEO, withI18nBundle} from '../components';
import i18nBundle from './page-home.i18n.json';


const styles = createStyles({
    main: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
});

type TPageHomeProps = WithStyles & WithI18nProps;

class ComposedPageHome extends Component<TPageHomeProps> {

    render(): ReactNode {
        const {classes, i18n} = this.props;

        return (
            <main className={classes.main}>
                <SEO i18n={i18n}/>

                <h1>{i18n.translate('page:heading')}</h1>
                {i18n.translate('page:text', COMMON_I18N_REPLACEMENTS)}

            </main>
        );
    }
}


export const PageHome = withI18nBundle('page-home', i18nBundle)(
    withStyles(styles)(
        ComposedPageHome,
    ),
);

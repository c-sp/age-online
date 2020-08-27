import {EXTERNAL_LINK_PROPS, LastGitCommit} from '@age-online/lib-common';
import {createStyles, Paper, WithStyles, withStyles} from '@material-ui/core';
import {GitHub} from '@material-ui/icons';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, ReactNode} from 'react';
import {COMMON_I18N_REPLACEMENTS, SEO, withI18nBundle} from '../../components';
import i18nBundle from './home-page.i18n.json';


const styles = createStyles({
    main: {
        textAlign: 'center',
    },
});

type THomePageProps = WithStyles & WithI18nProps;

class ComposedHomePage extends Component<THomePageProps> {

    render(): ReactNode {
        const {classes, i18n} = this.props;

        const hrefCommit = `https://github.com/c-sp/age-online/tree/${LastGitCommit.hash}`;
        const hrefBranch = `https://github.com/c-sp/age-online/tree/${LastGitCommit.branch}`;

        return (
            <Paper component={'main'} className={classes.main} elevation={0}>
                <SEO i18n={i18n}/>
                <h1>{i18n.translate('page:heading')}</h1>

                <p><a href={'https://github.com/c-sp/age-online'}
                      aria-label={i18n.translate('link:repo')}
                      {...EXTERNAL_LINK_PROPS}>
                    <GitHub fontSize={'large'}/>
                </a></p>

                <p>{i18n.translate(
                    'page:text',
                    {
                        ...COMMON_I18N_REPLACEMENTS,
                        commitLink: <a href={hrefCommit}
                                       aria-label={i18n.translate('link:commit')}
                                       {...EXTERNAL_LINK_PROPS}>{LastGitCommit.shortHash}</a>,
                        branchLink: <a href={hrefBranch}
                                       aria-label={i18n.translate('link:branch')}
                                       {...EXTERNAL_LINK_PROPS}>{LastGitCommit.branch}</a>,
                    },
                )}</p>

            </Paper>
        );
    }
}


export const HomePage = withI18nBundle('home-page', i18nBundle)(
    withStyles(styles)(
        ComposedHomePage,
    ),
);

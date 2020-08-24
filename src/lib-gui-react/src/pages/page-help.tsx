import {EXTERNAL_LINK_PROPS, LastGitCommit} from '@age-online/lib-common';
import {createStyles, WithStyles, withStyles} from '@material-ui/core';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, ReactNode} from 'react';
import {COMMON_I18N_REPLACEMENTS, SEO, withI18nBundle} from '../components';
import GitHubIcon from '@material-ui/icons/GitHub';
import i18nBundle from './page-help.i18n.json';


const styles = createStyles({
    main: {
        textAlign: 'center',
    },
});

type TPageHelpProps = WithStyles & WithI18nProps;

class ComposedPageHelp extends Component<TPageHelpProps> {

    render(): ReactNode {
        const {classes, i18n} = this.props;

        const hrefCommit = `https://github.com/c-sp/age-online/tree/${LastGitCommit.hash}`;
        const hrefBranch = `https://github.com/c-sp/age-online/tree/${LastGitCommit.branch}`;

        return (
            <main className={classes.main}>
                <SEO i18n={i18n}/>

                <h1>{i18n.translate('page:heading')}</h1>

                <h2>{i18n.translate('source:heading')}</h2>
                <p><a href={'https://github.com/c-sp/age-online'}
                      aria-label={i18n.translate('source:repo')}
                      {...EXTERNAL_LINK_PROPS}>
                    <GitHubIcon fontSize={'large'}/>
                </a></p>

                <p>{i18n.translate(
                    'source:current',
                    {
                        ...COMMON_I18N_REPLACEMENTS,
                        commitLink: <a href={hrefCommit} {...EXTERNAL_LINK_PROPS}>{LastGitCommit.shortHash}</a>,
                        branchLink: <a href={hrefBranch} {...EXTERNAL_LINK_PROPS}>{LastGitCommit.branch}</a>,
                    },
                )}</p>

            </main>
        );
    }
}


export const PageHelp = withI18nBundle('page-help', i18nBundle)(
    withStyles(styles)(
        ComposedPageHelp,
    ),
);

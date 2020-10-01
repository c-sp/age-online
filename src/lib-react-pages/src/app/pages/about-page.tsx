import {LastGitCommit} from '@age-online/lib-core';
import {createStyles, IconButton, Paper, Theme, Typography, WithStyles, withStyles} from '@material-ui/core';
import {GitHub} from '@material-ui/icons';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, ReactNode} from 'react';
import i18nBundle from './about-page.i18n.json';
import {
    COMMON_I18N_REPLACEMENTS,
    EXTERNAL_LINK_PROPS,
    ISiteApiProps,
    SEO,
    withI18nBundle,
    withSiteApi,
} from '@age-online/lib-react';


const styles = (theme: Theme) => createStyles({
    main: {
        minHeight: '100%', // extend <Paper> style to the page's bottom
        padding: theme.spacing(2),
        textAlign: 'center',

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        '& > :nth-child(n+2)': {
            marginTop: theme.spacing(3),
        },
    },
    text: {
        maxWidth: '30em',
    },
    repo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        '& svg': {
            // remove descenders, see also:
            // https://stackoverflow.com/a/5804278
            display: 'block',
        },

        '& > :last-child': {
            textAlign: 'left',
        },
    },
});

type TAboutPageProps = WithStyles & WithI18nProps & ISiteApiProps;

class ComposedAboutPage extends Component<TAboutPageProps> {

    render(): ReactNode {
        const {classes, i18n, siteApi} = this.props;
        const {committedOn, hash, shortHash, branch} = LastGitCommit;

        const thirdPartyReplacements = {
            ...COMMON_I18N_REPLACEMENTS,

            licensesLink: <a href={siteApi.assetUrl('age-online.licenses.txt')}
                             aria-label={i18n.translate('third-party:link-label')}
                             {...EXTERNAL_LINK_PROPS}>{i18n.translate('third-party:link')}</a>,
        };

        const commitReplacements = {
            ...COMMON_I18N_REPLACEMENTS,

            commitLink: <a href={`https://github.com/c-sp/age-online/tree/${hash}`}
                           aria-label={i18n.translate('link:commit')}
                           {...EXTERNAL_LINK_PROPS}>{shortHash}</a>,

            commitDate: <span style={{whiteSpace: 'nowrap'}}>{i18n.formatDate(
                new Date(parseInt(committedOn, 10) * 1000),
                {
                    // https://tc39.es/ecma402/#datetimeformat-objects
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short',
                },
            )}</span>,

            branchLink: <a href={`https://github.com/c-sp/age-online/tree/${branch}`}
                           aria-label={i18n.translate('link:branch')}
                           {...EXTERNAL_LINK_PROPS}>{branch}</a>,
        };

        return (
            <Paper component={'main'} className={classes.main} elevation={0}>
                <SEO i18n={i18n}/>
                <h1>{i18n.translate('heading')}</h1>

                <div className={classes.text}>{i18n.translate('text1', COMMON_I18N_REPLACEMENTS)}</div>
                <div className={classes.text}>{i18n.translate('text2', COMMON_I18N_REPLACEMENTS)}</div>

                <div className={classes.repo}>
                    <a href={'https://github.com/c-sp/age-online'}
                       aria-label={i18n.translate('link:repo')}
                       {...EXTERNAL_LINK_PROPS}>

                        <IconButton aria-label={i18n.translate('link:repo')} color="primary">
                            <GitHub fontSize="large"/>
                        </IconButton>
                    </a>

                    <Typography component={'div'}
                                variant="caption">{i18n.translate('commit', commitReplacements)}</Typography>
                </div>

                <Typography component={'div'}
                            variant="caption">{i18n.translate('third-party', thirdPartyReplacements)}</Typography>
            </Paper>
        );
    }
}


export const AboutPage = withI18nBundle('about-page', i18nBundle)(
    withStyles(styles)(
        withSiteApi(
            ComposedAboutPage,
        ),
    ),
);

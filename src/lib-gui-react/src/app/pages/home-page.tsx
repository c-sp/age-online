import {LastGitCommit} from '@age-online/lib-common';
import {Button, createStyles, IconButton, Paper, Theme, Typography, WithStyles, withStyles} from '@material-ui/core';
import {GitHub} from '@material-ui/icons';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, ReactNode} from 'react';
import {
    Cartridge,
    COMMON_I18N_REPLACEMENTS,
    EXTERNAL_LINK_PROPS,
    OpenLocalRomFile,
    SEO,
    withI18nBundle,
} from '../../components';
import {IPersistentAppStateProps, withPersistentAppState} from '../app-state';
import i18nBundle from './home-page.i18n.json';


const styles = (theme: Theme) => createStyles({
    main: {
        minHeight: '100%', // extend <Paper> style to the page's bottom
        padding: theme.spacing(2),
        textAlign: 'center',

        '& > :nth-child(1)': {
            marginBottom: 0,
        },
        '& > :nth-child(2)': {
            marginTop: 0,
        },

        '& > :nth-child(n+3)': {
            marginTop: theme.spacing(3),
        },

        '& > :last-child': {
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
    },
});

const StyledButton = withStyles({
    label: {
        flexDirection: 'column',
    },
})(Button) as typeof Button; // the cast is required to allow component="span" below

type THomePageProps = WithStyles & WithI18nProps & IPersistentAppStateProps;

class ComposedHomePage extends Component<THomePageProps> {

    render(): ReactNode {
        const {classes, i18n, persistentAppState} = this.props;

        const hrefCommit = `https://github.com/c-sp/age-online/tree/${LastGitCommit.hash}`;
        const hrefBranch = `https://github.com/c-sp/age-online/tree/${LastGitCommit.branch}`;

        const commitedOn = new Date(parseInt(LastGitCommit.committedOn, 10) * 1000);
        const commitReplacements = {
            ...COMMON_I18N_REPLACEMENTS,

            commitLink: <a href={hrefCommit}
                           aria-label={i18n.translate('link:commit')}
                           {...EXTERNAL_LINK_PROPS}>{LastGitCommit.shortHash}</a>,

            commitDate: <span style={{whiteSpace: 'nowrap'}}>{i18n.formatDate(commitedOn, {
                // https://tc39.es/ecma402/#datetimeformat-objects
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short',
            })}</span>,

            branchLink: <a href={hrefBranch}
                           aria-label={i18n.translate('link:branch')}
                           {...EXTERNAL_LINK_PROPS}>{LastGitCommit.branch}</a>,
        };

        return (
            <Paper component={'main'} className={classes.main} elevation={0}>
                <SEO i18n={i18n}/>
                <h1>{i18n.translate('page:heading1')}</h1>
                <h2>{i18n.translate('page:heading2')}</h2>

                <div>
                    <OpenLocalRomFile openRomFile={localFile => persistentAppState.setRomSource({localFile})}>
                        <StyledButton color="primary" component="span">
                            <Cartridge style={{fontSize: '100px'}}/>
                            <span>{i18n.translate('page:open-rom-file', COMMON_I18N_REPLACEMENTS)}</span>
                        </StyledButton>
                    </OpenLocalRomFile>
                </div>

                <div>
                    <a href={'https://github.com/c-sp/age-online'}
                       aria-label={i18n.translate('link:repo')}
                       {...EXTERNAL_LINK_PROPS}>

                        <IconButton aria-label={i18n.translate('link:repo')} color="primary">
                            <GitHub fontSize="large"/>
                        </IconButton>
                    </a>

                    <Typography component={'div'}
                                variant="caption">{i18n.translate('page:commit', commitReplacements)}</Typography>
                </div>

            </Paper>
        );
    }
}


export const HomePage = withI18nBundle('home-page', i18nBundle)(
    withStyles(styles)(
        withPersistentAppState(
            ComposedHomePage,
        ),
    ),
);

import {EXTERNAL_LINK_PROPS, LastGitCommit} from '@age-online/lib-common';
import {createStyles, Paper, WithStyles, withStyles} from '@material-ui/core';
import {GitHub} from '@material-ui/icons';
import {DateStyle, WithI18nProps} from '@shopify/react-i18n';
import React, {Component, ReactNode} from 'react';
import {Cartridge, COMMON_I18N_REPLACEMENTS, OpenLocalFile, SEO, withI18nBundle} from '../../components';
import {IPersistentAppStateProps, withPersistentAppState} from '../app-state';
import i18nBundle from './home-page.i18n.json';


const styles = createStyles({
    main: {
        padding: '32px',
        textAlign: 'center',

        '& > :last-child': {
            marginTop: '3em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            '& > :last-child': {
                marginLeft: '1em',
                textAlign: 'left',
            }
        }
    },
});

type THomePageProps = WithStyles & WithI18nProps & IPersistentAppStateProps;

class ComposedHomePage extends Component<THomePageProps> {

    render(): ReactNode {
        const {classes, i18n, persistentAppState} = this.props;

        const hrefCommit = `https://github.com/c-sp/age-online/tree/${LastGitCommit.hash}`;
        const hrefBranch = `https://github.com/c-sp/age-online/tree/${LastGitCommit.branch}`;

        const commitedOn = new Date(parseInt(LastGitCommit.committedOn) * 1000);

        return (
            <Paper component={'main'} className={classes.main} elevation={0}>
                <SEO i18n={i18n}/>
                <h1>{i18n.translate('page:heading')}</h1>

                <div>
                    <OpenLocalFile accept=".gb, .gbc, .zip"
                                   aria-label={i18n.translate('label:open-file')}
                                   openFile={localFile => persistentAppState.openRomFile({localFile})}>

                        <Cartridge style={{fontSize: '100px'}} color="primary"/>
                    </OpenLocalFile><br/>
                    open rom file
                </div>

                <div>
                    <a href={'https://github.com/c-sp/age-online'}
                       aria-label={i18n.translate('link:repo')}
                       {...EXTERNAL_LINK_PROPS}>

                        <GitHub fontSize="large"/>
                    </a>

                    <div>{i18n.translate(
                        'commit:text',
                        {
                            ...COMMON_I18N_REPLACEMENTS,
                            commitLink: <a href={hrefCommit}
                                           aria-label={i18n.translate('link:commit')}
                                           {...EXTERNAL_LINK_PROPS}>{LastGitCommit.shortHash}</a>,
                            commitDate: i18n.formatDate(commitedOn, {style: DateStyle.Humanize}),
                            branchLink: <a href={hrefBranch}
                                           aria-label={i18n.translate('link:branch')}
                                           {...EXTERNAL_LINK_PROPS}>{LastGitCommit.branch}</a>,
                        },
                    )}</div>
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

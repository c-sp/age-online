import {Button, createStyles, Paper, Theme, WithStyles, withStyles} from '@material-ui/core';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, ReactNode} from 'react';
import {IPersistentAppStateProps, withPersistentAppState} from '../app-state';
import i18nBundle from './home-page.i18n.json';
import {Cartridge, COMMON_I18N_REPLACEMENTS, OpenLocalRomFile, SEO, withI18nBundle} from '@age-online/lib-react';


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

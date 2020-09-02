import {createStyles, fade, IconButton, StyleRules, Theme, WithStyles, withStyles} from '@material-ui/core';
import {SettingsTwoTone} from '@material-ui/icons';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, CSSProperties} from 'react';
import {withI18nBundle} from '../i18n';
import {AppPage, ISiteApiProps, withSiteApi} from '../site-api';
import i18nBundle from './emulator-toolbar.i18n.json';


function styles(theme: Theme): StyleRules {
    return createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: fade(theme.palette.background.default, 0.8),
        },
    });
}

/**
 * to override Material UI styles we have to use a custom
 * CSSProperties instance
 */
const ICON_STYLE: CSSProperties = {
    fontSize: '40px',
    // remove descenders, see also:
    // https://stackoverflow.com/a/5804278
    display: 'block',
    opacity: '0.5',
};


export interface IEmulatorToolbarProps {
    readonly className?: string;
}

type TNavProps = IEmulatorToolbarProps & ISiteApiProps & WithStyles & WithI18nProps;

class ComposedEmulatorToolbar extends Component<TNavProps> {

    constructor(props: TNavProps) {
        super(props);
    }

    render(): JSX.Element {
        const {className, classes, i18n, siteApi: {SiteLink}} = this.props;

        const classNames = className ? `${className} ${classes.root}` : classes.root;

        return (
            <nav className={classNames}>

                <SiteLink appPage={AppPage.SETTINGS}>
                    <IconButton aria-label={i18n.translate('link:settings')}>
                        <SettingsTwoTone style={ICON_STYLE}/>
                    </IconButton>
                </SiteLink>

            </nav>
        );
    }
}


export const EmulatorToolbar = withStyles(styles)(
    withI18nBundle('emulator-toolbar', i18nBundle)(
        withSiteApi(
            ComposedEmulatorToolbar,
        ),
    ),
);

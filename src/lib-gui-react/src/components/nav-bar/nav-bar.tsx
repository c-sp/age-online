import {createStyles, fade, IconButton, StyleRules, Theme, WithStyles, withStyles} from '@material-ui/core';
import {HomeOutlined, InfoOutlined, SettingsOutlined} from '@material-ui/icons';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, CSSProperties} from 'react';
import {withI18nBundle} from '../i18n';
import {AppPage, IWithSiteApiProps, withSiteApi} from '../site-api';
import i18nBundle from './nav-bar.i18n.json';


function styles(theme: Theme): StyleRules {
    return createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: fade(theme.palette.background.default, 0.5),
        },
        horizontal: {
            flexDirection: 'row',
            justifyContent: 'center',
        },
        vertical: {
            flexDirection: 'column',
        },
    });
}


export interface INavBarProps {
    readonly verticalBar: boolean;
    readonly style?: CSSProperties;
}

type TNavProps = INavBarProps & IWithSiteApiProps & WithStyles & WithI18nProps;

class ComposedNavBar extends Component<TNavProps> {

    constructor(props: TNavProps) {
        super(props);
    }

    render(): JSX.Element {
        const {classes, verticalBar, style, i18n, siteApi: {SiteLink}} = this.props;

        const classNames = `${classes.root} ${verticalBar ? classes.vertical : classes.horizontal}`;

        return (
            <div className={classNames} style={style}>
                <SiteLink appPage={AppPage.HOME}>
                    <IconButton aria-label={i18n.translate('link:home')}><HomeOutlined/></IconButton>
                </SiteLink>
                <SiteLink appPage={AppPage.HELP}>
                    <IconButton aria-label={i18n.translate('link:help')}><InfoOutlined/></IconButton>
                </SiteLink>
                <SiteLink appPage={AppPage.SETTINGS}>
                    <IconButton aria-label={i18n.translate('link:settings')}><SettingsOutlined/></IconButton>
                </SiteLink>
            </div>
        );
    }
}

export const NavBar = withStyles(styles)(
    withI18nBundle('nav-bar', i18nBundle)(
        withSiteApi(
            ComposedNavBar,
        ),
    ),
);

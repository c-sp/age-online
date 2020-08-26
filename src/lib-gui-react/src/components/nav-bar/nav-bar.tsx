import {createStyles, fade, IconButton, StyleRules, SvgIcon, Theme, WithStyles, withStyles} from '@material-ui/core';
import {Home, HomeTwoTone, Info, InfoTwoTone, SettingsRounded, SettingsTwoTone} from '@material-ui/icons';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, CSSProperties, ReactElement} from 'react';
import {withI18nBundle} from '../i18n';
import {AppPage, ISiteApiProps, withSiteApi} from '../site-api';
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

/**
 * to override Material UI styles we have to use a custom
 * CSSProperties instance
 */
const ICON_STYLE_ACTIVE: CSSProperties = {
    fontSize: '40px',
    // remove descenders, see also:
    // https://stackoverflow.com/a/5804278
    display: 'block',
};

const ICON_STYLE_INACTIVE: CSSProperties = {
    ...ICON_STYLE_ACTIVE,
    opacity: '0.5',
};


export interface INavBarProps {
    readonly verticalBar: boolean;
    readonly currentPage: AppPage;
    readonly style?: CSSProperties;
}

type TNavProps = INavBarProps & ISiteApiProps & WithStyles & WithI18nProps;

class ComposedNavBar extends Component<TNavProps> {

    constructor(props: TNavProps) {
        super(props);
    }

    render(): JSX.Element {
        const {classes, verticalBar, style, i18n, siteApi: {SiteLink}} = this.props;

        const classNames = `${classes.root} ${verticalBar ? classes.vertical : classes.horizontal}`;

        const HomeIcon = this.icon(AppPage.HOME, Home, HomeTwoTone);
        const HelpIcon = this.icon(AppPage.HELP, Info, InfoTwoTone);
        const SettingsIcon = this.icon(AppPage.SETTINGS, SettingsRounded, SettingsTwoTone);

        return (
            <div className={classNames} style={style}>
                <SiteLink appPage={AppPage.HOME}>
                    <IconButton aria-label={i18n.translate('link:home')}>{HomeIcon}</IconButton>
                </SiteLink>
                <SiteLink appPage={AppPage.HELP}>
                    <IconButton aria-label={i18n.translate('link:help')}>{HelpIcon}</IconButton>
                </SiteLink>
                <SiteLink appPage={AppPage.SETTINGS}>
                    <IconButton aria-label={i18n.translate('link:settings')}>{SettingsIcon}</IconButton>
                </SiteLink>
            </div>
        );
    }

    private icon(forPage: AppPage,
                 ActiveIcon: typeof SvgIcon,
                 InactiveIcon: typeof SvgIcon): ReactElement {

        return this.props.currentPage === forPage
            ? <ActiveIcon style={ICON_STYLE_ACTIVE}/>
            : <InactiveIcon style={ICON_STYLE_INACTIVE}/>;
    }
}


export const NavBar = withStyles(styles)(
    withI18nBundle('nav-bar', i18nBundle)(
        withSiteApi(
            ComposedNavBar,
        ),
    ),
);

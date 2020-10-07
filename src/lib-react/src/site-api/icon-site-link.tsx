import {Badge, IconButton} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Error, Info, SettingsOutlined, SettingsRounded} from '@material-ui/icons';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, ComponentType, CSSProperties, ReactElement, ReactNode} from 'react';
import i18nBundle from './icon-site-link.i18n.json';
import {AppPage} from './site-api';
import {ISiteApiProps, withSiteApi} from './with-site-api';
import {withI18nBundle} from '../i18n';
import {EmulatorIcon} from '../icons';


export interface IStyleProps {
    readonly style?: CSSProperties;
}

type TIconSiteLinkProps = IStyleProps & ISiteApiProps & WithI18nProps;

function iconSiteLink(appPage: AppPage,
                      Icon: ComponentType<IStyleProps>,
                      i18nKey: string) {

    return withI18nBundle('site-link', i18nBundle)(
        withSiteApi(
            class IconSiteLink extends Component<TIconSiteLinkProps> {

                render(): ReactNode {
                    const {style, i18n, siteApi: {SiteLink}} = this.props;
                    return (
                        <SiteLink appPage={appPage}>
                            <IconButton aria-label={i18n.translate(i18nKey)}>
                                <Icon style={style}/>
                            </IconButton>
                        </SiteLink>
                    );
                }

            },
        ),
    );
}


function EmulatorErrorIcon({style}: IStyleProps): ReactElement {
    return (
        <Badge badgeContent={<Error color="error" style={{opacity: 0.5}}/>}
               overlap="circle">

            <EmulatorIcon style={style}/>
        </Badge>
    );
}


const useLoadingStyles = makeStyles({
    '@keyframes animateIcon': {
        from: {transform: 'rotate(0deg)'},
        to: {transform: 'rotate(360deg)'},
    },
    animatedIcon: {
        animation: '2s ease-in-out 0s infinite $animateIcon',
    },
});

function EmulatorLoadingIcon({style}: IStyleProps): ReactElement {
    const classes = useLoadingStyles();
    return (
        <Badge badgeContent={<SettingsOutlined className={classes.animatedIcon} color="disabled"/>}
               overlap="circle">

            <EmulatorIcon style={style}/>
        </Badge>
    );
}


const useRunningStyles = makeStyles({
    '@keyframes animateIcon': {
        from: {transform: 'scale(0.8)'},
        to: {transform: 'scale(1.2)'},
    },
    animatedIcon: {
        animation: '1s ease-in-out 0s infinite alternate $animateIcon',
    },
});

function EmulatorRunningIcon({style}: IStyleProps): ReactElement {
    const classes = useRunningStyles();
    return (
        <EmulatorIcon className={classes.animatedIcon} style={style}/>
    );
}


export const EmulatorLoadingIconSiteLink = iconSiteLink(AppPage.HOME, EmulatorLoadingIcon, 'emulator');
export const EmulatorErrorIconSiteLink = iconSiteLink(AppPage.HOME, EmulatorErrorIcon, 'emulator');
export const EmulatorRunningIconSiteLink = iconSiteLink(AppPage.HOME, EmulatorRunningIcon, 'emulator');

export const HomeIconSiteLink = iconSiteLink(AppPage.HOME, EmulatorIcon, 'home');
export const SettingsIconSiteLink = iconSiteLink(AppPage.SETTINGS, SettingsRounded, 'settings');
export const AboutIconSiteLink = iconSiteLink(AppPage.ABOUT, Info, 'about');

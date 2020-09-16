import {assertNever} from '@age-online/lib-common';
import {createStyles, WithStyles, withStyles} from '@material-ui/core';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, ComponentType, CSSProperties, ReactNode} from 'react';
import {TOOLBAR_ICON_STYLE} from '../common';
import {withI18nBundle} from '../i18n';
import {
    AppPage,
    EmulatorErrorIconSiteLink,
    EmulatorLoadingIconSiteLink,
    EmulatorRunningIconSiteLink,
    HomeIconSiteLink,
    IStyleProps,
    SettingsIconSiteLink,
} from '../site-api';
import i18nBundle from './page-nav-bar.i18n.json';


const styles = createStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    vertical: {
        flexDirection: 'column',
    },
});

const ICON_STYLE_INACTIVE: CSSProperties = {
    ...TOOLBAR_ICON_STYLE,
    opacity: '0.5',
};


export enum EmulatorState {
    NO_EMULATOR = 'no-emulator',
    EMULATOR_LOADING = 'emulator-loading',
    EMULATOR_READY = 'emulator-ready',
    EMULATOR_ERROR = 'emulator-error',
}

export interface IPageNavBarProps {
    readonly verticalBar?: boolean;
    readonly currentPage?: AppPage;
    readonly emulatorState?: EmulatorState;
}

type TPageNavBarProps = IPageNavBarProps & WithStyles & WithI18nProps;

class ComposedPageNavBar extends Component<TPageNavBarProps> {

    render(): ReactNode {
        const {classes, i18n, verticalBar} = this.props;

        const HomeIcon = this.HomeIcon();
        const classNames = `${classes.root} ${verticalBar ? classes.vertical : classes.horizontal}`;

        return (
            <nav className={classNames}
                 aria-label={i18n.translate('nav-label')}>

                <HomeIcon style={this.iconStyle(AppPage.HOME)}/>
                <SettingsIconSiteLink style={this.iconStyle(AppPage.SETTINGS)}/>

            </nav>
        );
    }

    private HomeIcon(): ComponentType<IStyleProps> {
        const {emulatorState} = this.props;
        switch (emulatorState) {

            case undefined:
            case EmulatorState.NO_EMULATOR:
                return HomeIconSiteLink;

            case EmulatorState.EMULATOR_LOADING:
                return EmulatorLoadingIconSiteLink;

            case EmulatorState.EMULATOR_ERROR:
                return EmulatorErrorIconSiteLink;

            case EmulatorState.EMULATOR_READY:
                return EmulatorRunningIconSiteLink;

            default:
                return assertNever(emulatorState);
        }
    }

    private iconStyle(appPage: AppPage): CSSProperties {
        return this.props.currentPage === appPage ? TOOLBAR_ICON_STYLE : ICON_STYLE_INACTIVE;
    }
}


export const PageNavBar = withStyles(styles)(
    withI18nBundle('page-nav-bar', i18nBundle)(
        ComposedPageNavBar,
    ),
);

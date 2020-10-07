import {assertNever} from '@age-online/lib-core';
import {createStyles, WithStyles, withStyles} from '@material-ui/core';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, ComponentType, CSSProperties, ReactNode} from 'react';
import {
    AboutIconSiteLink,
    AppPage,
    EmulatorErrorIconSiteLink,
    EmulatorLoadingIconSiteLink,
    EmulatorRunningIconSiteLink,
    HomeIconSiteLink,
    IStyleProps,
    SettingsIconSiteLink,
    TOOLBAR_ICON_STYLE,
    withI18nBundle,
} from '@age-online/lib-react';
import i18nBundle from './page-nav-bar.i18n.json';
import {EmulatorState} from '@age-online/lib-react-emulator';


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

const ICON_STYLE_ACTIVE: CSSProperties = {
    ...TOOLBAR_ICON_STYLE,
    opacity: 1,
};

const ICON_STYLE_INACTIVE: CSSProperties = {
    ...TOOLBAR_ICON_STYLE,
    opacity: 0.5,
};


export interface IPageNavBarProps {
    readonly verticalBar?: boolean;
    readonly currentPage?: AppPage;
    readonly emulatorState?: EmulatorState;
}

type TPageNavBarProps = IPageNavBarProps & WithStyles & WithI18nProps;

class ComposedPageNavBar extends Component<TPageNavBarProps> {

    render(): ReactNode {
        const {classes, i18n, verticalBar} = this.props;

        const HomeIcon = this.homeIcon();
        const classNames = `${classes.root} ${verticalBar ? classes.vertical : classes.horizontal}`;

        return (
            <nav className={classNames}
                 aria-label={i18n.translate('nav-label')}>

                <HomeIcon style={this.iconStyle(AppPage.HOME)}/>
                <SettingsIconSiteLink style={this.iconStyle(AppPage.SETTINGS)}/>
                <AboutIconSiteLink style={this.iconStyle(AppPage.ABOUT)}/>

            </nav>
        );
    }

    private homeIcon(): ComponentType<IStyleProps> {
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
        return this.props.currentPage === appPage ? ICON_STYLE_ACTIVE : ICON_STYLE_INACTIVE;
    }
}


export const PageNavBar = withStyles(styles)(
    withI18nBundle('page-nav-bar', i18nBundle)(
        ComposedPageNavBar,
    ),
);

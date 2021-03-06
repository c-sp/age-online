import {createStyles, IconButton, WithStyles, withStyles} from '@material-ui/core';
import {WithI18nProps} from '@shopify/react-i18n';
import {GoogleController, GoogleControllerOff} from 'mdi-material-ui';
import React, {Component, ReactNode} from 'react';
import i18nBundle from './emulator-toolbars.i18n.json';
import {assertNever, cssClasses} from '@age-online/lib-core';
import {
    CartridgeIcon,
    OpenLocalRomFile,
    SettingsIconSiteLink,
    TOOLBAR_ICON_STYLE,
    withI18nBundle,
} from '@age-online/lib-react';
import {DisplayControls} from '../../api';


const styles = createStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        maxWidth: 'calc(100% - 128px)',
    },
});


export interface IEmulatorToolbarProps {
    readonly className?: string;
    readonly displayControls: DisplayControls;

    openRomFile?(file: File): void;

    changeDisplayControls?(displayControls: DisplayControls): void;
}

type TEmulatorToolbarProps = IEmulatorToolbarProps & WithI18nProps & WithStyles;

class ComposedEmulatorToolbar extends Component<TEmulatorToolbarProps> {

    render(): ReactNode {
        const {classes, className, i18n, openRomFile, displayControls, changeDisplayControls} = this.props;
        const nextDisplayControls = cycleDisplayControls(displayControls);
        return (
            <div className={cssClasses(className, classes.root)}>

                <OpenLocalRomFile openRomFile={file => openRomFile?.(file)}>
                    <IconButton component="span" aria-label={i18n.translate('open-rom-file')}>
                        <CartridgeIcon style={TOOLBAR_ICON_STYLE}/>
                    </IconButton>
                </OpenLocalRomFile>

                {(nextDisplayControls === DisplayControls.HIDDEN) && (
                    <IconButton component="span"
                                aria-label={i18n.translate('hide-controls')}
                                onClick={() => changeDisplayControls?.(nextDisplayControls)}>
                        <GoogleControllerOff style={TOOLBAR_ICON_STYLE}/>
                    </IconButton>
                )}

                {(nextDisplayControls === DisplayControls.VISIBLE_OVERLAY) && (
                    <IconButton component="span"
                                aria-label={i18n.translate('show-controls-overlay')}
                                onClick={() => changeDisplayControls?.(nextDisplayControls)}>
                        <GoogleController style={{
                            ...TOOLBAR_ICON_STYLE,
                            border: '3px solid',
                        }}/>
                    </IconButton>
                )}

                {(nextDisplayControls === DisplayControls.VISIBLE) && (
                    <IconButton component="span"
                                aria-label={i18n.translate('show-controls')}
                                onClick={() => changeDisplayControls?.(nextDisplayControls)}>
                        <GoogleController style={TOOLBAR_ICON_STYLE}/>
                    </IconButton>
                )}

                <SettingsIconSiteLink style={TOOLBAR_ICON_STYLE}/>

            </div>
        );
    }
}

export const EmulatorToolbar = withStyles(styles)(
    withI18nBundle('emulator-toolbar', i18nBundle)(
        ComposedEmulatorToolbar,
    ),
);


export function cycleDisplayControls(displayControls: DisplayControls): DisplayControls {
    switch (displayControls) {

        case DisplayControls.HIDDEN:
            return DisplayControls.VISIBLE;

        case DisplayControls.VISIBLE_OVERLAY:
            return DisplayControls.HIDDEN;

        case DisplayControls.VISIBLE:
            return DisplayControls.VISIBLE_OVERLAY;

        default:
            return assertNever(displayControls);
    }
}

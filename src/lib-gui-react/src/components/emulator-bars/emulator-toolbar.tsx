import {createStyles, IconButton, WithStyles, withStyles} from '@material-ui/core';
import {WithI18nProps} from '@shopify/react-i18n';
import {GoogleController, GoogleControllerOff} from 'mdi-material-ui';
import React, {Component, ReactNode} from 'react';
import {EmulatorOverlay, OpenLocalRomFile, TOOLBAR_ICON_STYLE} from '../common';
import {DisplayControls} from '../emulator';
import {Cartridge} from '../icons';
import {SettingsIconSiteLink} from '../site-api';
import i18nBundle from './emulator-toolbars.i18n.json';
import {withI18nBundle} from "../i18n";
import {cssClasses} from "@age-online/lib-common";


const styles = createStyles({
    toolbar: {
        display: 'flex',
        alignItems: 'center',
    },
});


export interface IEmulatorToolbarProps {
    readonly className?: string;
    readonly displayControls: DisplayControls;

    openRomFile?(file: File): void;

    cycleDisplayControls?(): void;
}

type TEmulatorToolbarProps = IEmulatorToolbarProps & WithI18nProps & WithStyles;

class ComposedEmulatorToolbar extends Component<TEmulatorToolbarProps> {

    render(): ReactNode {
        const {classes, className, i18n, openRomFile, displayControls, cycleDisplayControls} = this.props;
        return (
            <EmulatorOverlay className={cssClasses(className, classes.toolbar)}>

                <OpenLocalRomFile openRomFile={file => openRomFile?.(file)}>
                    <IconButton component="span" aria-label={i18n.translate('open-rom-file')}>
                        <Cartridge style={TOOLBAR_ICON_STYLE}/>
                    </IconButton>
                </OpenLocalRomFile>

                {(displayControls === DisplayControls.HIDDEN) && (
                    <IconButton component="span"
                                aria-label={i18n.translate('show-controls')}
                                onClick={() => cycleDisplayControls?.()}>
                        <GoogleController style={TOOLBAR_ICON_STYLE}/>
                    </IconButton>
                )}

                {(displayControls === DisplayControls.VISIBLE) && (
                    <IconButton component="span"
                                aria-label={i18n.translate('show-controls-overlay')}
                                onClick={() => cycleDisplayControls?.()}>
                        <GoogleController style={{
                            ...TOOLBAR_ICON_STYLE,
                            border: '3px solid',
                        }}/>
                    </IconButton>
                )}

                {(displayControls === DisplayControls.VISIBLE_OVERLAY) && (
                    <IconButton component="span"
                                aria-label={i18n.translate('hide-controls')}
                                onClick={() => cycleDisplayControls?.()}>
                        <GoogleControllerOff style={TOOLBAR_ICON_STYLE}/>
                    </IconButton>
                )}

                <SettingsIconSiteLink style={TOOLBAR_ICON_STYLE}/>

            </EmulatorOverlay>
        );
    }
}

export const EmulatorToolbar = withStyles(styles)(
    withI18nBundle('emulator-toolbar', i18nBundle)(
        ComposedEmulatorToolbar,
    ),
);

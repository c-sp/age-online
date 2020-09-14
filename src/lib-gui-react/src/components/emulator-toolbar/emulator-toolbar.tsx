import {IconButton} from '@material-ui/core';
import {WithI18nProps} from '@shopify/react-i18n';
import {GoogleController, GoogleControllerOff} from 'mdi-material-ui';
import React, {Component, ReactNode} from 'react';
import {OpenLocalRomFile, TOOLBAR_ICON_STYLE} from '../common';
import {EmulatorControls} from '../emulator';
import {Cartridge} from '../icons';
import {SettingsIconSiteLink} from '../site-api';
import {EmulatorBar, IEmulatorBarProps, withBarsI18n} from './emulator-bar';


export interface IEmulatorToolbarProps extends IEmulatorBarProps {
    openRomFile?(file: File): void;

    readonly emulatorControls: EmulatorControls;

    cycleEmulatorControls?(): void;
}

type TEmulatorToolbarProps = IEmulatorToolbarProps & WithI18nProps;

class ComposedEmulatorToolbar extends Component<TEmulatorToolbarProps> {

    render(): ReactNode {
        const {className, i18n, openRomFile, emulatorControls, cycleEmulatorControls} = this.props;
        return (
            <EmulatorBar className={className}
                         aria-label={i18n.translate('bar-label')}>

                <OpenLocalRomFile openRomFile={file => openRomFile?.(file)}>
                    <IconButton component="span" aria-label={i18n.translate('open-rom-file')}>
                        <Cartridge style={TOOLBAR_ICON_STYLE}/>
                    </IconButton>
                </OpenLocalRomFile>

                {(emulatorControls === EmulatorControls.HIDDEN)
                && <IconButton component="span"
                               aria-label={i18n.translate('show-controls')}
                               onClick={() => cycleEmulatorControls?.()}>
                    <GoogleController style={TOOLBAR_ICON_STYLE}/>
                </IconButton>}

                {(emulatorControls === EmulatorControls.VISIBLE)
                && <IconButton component="span"
                               aria-label={i18n.translate('show-controls-overlay')}
                               onClick={() => cycleEmulatorControls?.()}>
                    <GoogleController style={{
                        ...TOOLBAR_ICON_STYLE,
                        border: '3px solid',
                    }}/>
                </IconButton>}

                {(emulatorControls === EmulatorControls.VISIBLE_OVERLAY)
                && <IconButton component="span"
                               aria-label={i18n.translate('hide-controls')}
                               onClick={() => cycleEmulatorControls?.()}>
                    <GoogleControllerOff style={TOOLBAR_ICON_STYLE}/>
                </IconButton>}

                <SettingsIconSiteLink style={TOOLBAR_ICON_STYLE}/>

            </EmulatorBar>
        );
    }
}

export const EmulatorToolbar = withBarsI18n()(
    ComposedEmulatorToolbar,
);
